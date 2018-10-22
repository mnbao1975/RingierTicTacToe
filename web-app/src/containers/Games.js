import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

import config from "../config";
import "./NewGame.css";

export default class NewGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameData: {},
      marker: '', // Your marker
      socketURL: config.socket.URL
    };
  }

  componentDidMount() {
    const { socketURL } = this.state;
    const socket = socketIOClient(socketURL);

    socket.on('connect', () => {
      //console.log('Connected');      
      this.joinGame(socket, this.props.match.params.id);    
    });

    socket.on("started", data => console.log(data));
  }
  /**
   * Join to a incompleted game (new/saved).
   * @param {*} socket 
   */
  async joinGame(socket, gameId) {
    try {
      const res = await axios.get(`${config.apiURL}/games/${gameId}`);
      const marker = res.data.marker; // The choosen marker of Player1

      if (marker === 'O') {
        this.setState({ gameData: {marker: 'X', player: 'Play2'} });
      }
      let moves = res.data.moves;
      let players = { ...res.data.players, [this.state.player]: socket.id };
      socket.emit('joined', { _id: gameId, joinedPlayer: this.state.player, players });

      this.setState({
        gameData: { players, moves }
      });
    } catch (error) {
      alert('Cannot join game');
      console.error(error);
    }
  }

  render() {    
    return (    
      <div>
        <h2>Your marker: {this.props.marker}</h2>
        <h4>Next move: </h4>
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