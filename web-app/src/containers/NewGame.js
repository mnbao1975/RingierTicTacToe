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

    // Default data for new game.
    this.state = {
      gameId: '',
      name: 'Game R_' + Math.floor(Math.random() * 1000) + 1,
      marker: 'O',
      player: 'Player1', 
      next: 'O',
      players: null,
      state: 'NEW',
      winner: '',
      moves: Array(9).fill(''),
      socketURL: config.socket.URL,
      socket: null
    };
  }

  componentDidMount() {
    const { socketURL } = this.state;
    const socket = socketIOClient(socketURL);

    socket.on('connect', () => {
      //console.log(this.state);            
      this.newGame(socket);
      this.setState({ socket });
    });

    socket.on("started", data => this.startGame(socket, data));

    socket.on("moved", data => this.playerMoved(socket, data));

    socket.on('restarted', data => this.setState({ moves: Array(9).fill('') }));
  }
  /**
   * 
   * @param {*} socket 
   * @param {*} data 
   */
  playerMoved(socket, data) {
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
    //console.log(data);
    this.setState({
      state: data.state
    });
  }
  /**
   * Request API for a new game.
   */
  async newGame(socket) {    
    try {
      let players = { [this.state.player]: socket.id };
      this.setState({ players });
      
      let { name, marker, player, next } = this.state;      
      const res = await axios.post(`${config.api.URL}/games`, { 
        name, marker, player, next, players
      });     
      socket.emit('joined', { _id: res.data._id, players });            
      this.setState({ gameId: res.data._id });
    } catch (error) {
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
   * Restart games
   */
  handleRestart() {        
    this.setState({
      moves: Array(9).fill('')
    });
    let { socket, gameId } = this.state;
    socket.emit('restarted', { _id: gameId }); 
  }
  /**
   * 
   */
  render() {
    let currState = this.state.winner ? 'Completed! Winner is ' + this.state.winner : this.state.state;
    return (    
      <div>
        <h2>Your marker: {this.state.marker}</h2>
        <h4>Game name: {this.state.name}</h4>
        <h4>Game state: {currState}</h4>
        <h4>Next move: {this.state.next}</h4>
        {this.state.state === 'STARTED' 
          ? <Button onClick={() => this.handleRestart()}>Restart</Button>
          : ''
        }
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