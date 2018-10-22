import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import socketIOClient from "socket.io-client";
import axios from "axios";

import config from "../config";
import Box from "../components/Box";
import "./NewGame.css";

export default class NewGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameId: '',
      name: '',
      marker: '',
      player: '', 
      next: '',
      players: null,
      moves: Array(9).fill(''),
      winner: '',
      state: '',
      socketURL: config.socket.URL,
      socket: null
    };
  }

  componentDidMount() {
    const { socketURL } = this.state;
    const socket = socketIOClient(socketURL);

    socket.on('connect', () => {
      console.log('this.props.match.params.id');      
      this.joinGame(socket, this.props.match.params.id);
      
      this.setState({
        gameId: this.props.match.params.id,
        socket
      });          
    });

    socket.on("started", data => this.startGame(socket, data));

    socket.on("moved", data => this.playerMoved(socket, data));
  }
  /**
   * 
   */
  playerMoved(socket, data) {
    console.log('Player moved:');
    console.log(data.moves);    
    this.setState({
      state: data.state,
      winner: data.winner,
      next: data.next,
      moves: data.moves
    });
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
  /**
   * Handle rendering box
   * @param {*} i 
   */
  renderBox(i) {
    return (
      <Box 
        value={this.state.moves[i]}
        onClick={() => this.handleClick(i)} 
      />
    );
  }
  /**
   * Handle on click action
   */
  handleClick(i) {
    let { socket, moves, next, marker, player, state } = this.state;
    if(moves[i] || (next !== marker) || (state !== 'STARTED') ) {
      return;
    }
    
    moves[i] = marker;
    next = marker === 'O' ? 'X' : 'O';
    this.setState({ moves, next });

    socket.emit('moved', { 
      _id: this.state.gameId,
      moves,
      player,
      next,
    });    
  }
  /**
   * Reset games
   */
  handleReset() {

  }
  
  render() {
    let currState = this.state.winner ? 'Completed! Winner is ' + this.state.winner : this.state.state;    
    return (    
      <div>
        <h2>Your marker: {this.state.marker}</h2>
        <h4>Game name: {this.state.name}</h4>
        <h4>Game state: {currState}</h4>
        <h4>Next move: {this.state.next}</h4>
        <Button>Reset</Button>
        <div class="game-board">
          {this.renderBox(0)}
          {this.renderBox(1)}
          {this.renderBox(2)}
          {this.renderBox(3)}
          {this.renderBox(4)}
          {this.renderBox(5)}
          {this.renderBox(6)}
          {this.renderBox(7)}
          {this.renderBox(8)}
        </div>
      </div>
    );
  }
}