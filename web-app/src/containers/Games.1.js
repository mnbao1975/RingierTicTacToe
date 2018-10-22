import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

import config from "../config";
import "./NewGame.css";

export default class NewGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      marker: '',
      player: '', 
      next: '',
      players: null,
      moves: [],
      winner: '',
      state: '',
      socketURL: config.socket.URL
    };
  }

  componentDidMount() {
    const { socketURL } = this.state;
    const socket = socketIOClient(socketURL);

    socket.on('connect', () => {
      console.log('this.props.match.params.id');      
      this.joinGame(socket, this.props.match.params.id);    
    });

    socket.on("started", data => this.startGame(socket, data));
  }
  /**
   * Game is now ready to start
   * @param {*} socket 
   */
  startGame(socket, data) {
    this.setState({
      state: data.state
    });
  }
  /**
   * Join to a incompleted game (new/saved).
   * @param {*} socket 
   */
  async joinGame(socket, gameId) {
    try {
      const res = await axios.get(`${config.api.URL}/games/${gameId}`);
      let { name, marker, player, players, moves, next, winner, state } = res.data;
      
      if (marker === 'O') {
        marker = 'X';
        player = 'Player2';
      }   
      players = { ...res.data.players, [player]: socket.id };
      
      // Load game
      this.setState({ name, marker, player, players, moves, next, winner, state });

      if (state !== 'NEW') { // Just allow to join a new game.
        return;
      }
      socket.emit('joined', { _id: gameId, joinedPlayer: player, players, marker });
    } catch (error) {
      alert('Cannot join game');
      console.error(error);
    }
  }

  render() {    
    return (    
      <div>
        <h2>Your marker: {this.state.marker}</h2>
        <h4>Game name: {this.state.name}</h4>
        <h4>Game state: {this.state.state}</h4>
        <h4>Next move: {this.state.next}</h4>
        <div class="game-board">                
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
          <div class="box"></div>
        </div>
      </div>
    );
  }
}