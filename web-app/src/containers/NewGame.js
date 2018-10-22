import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

import config from "../config";
import "./NewGame.css";

export default class NewGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'Game R_' + Math.floor(Math.random() * 1000) + 1,
      marker: 'O',
      player: 'Player1', 
      next: 'O',
      players: null,
      socketURL: config.socket.URL
    };
  }

  componentDidMount() {
    const { socketURL } = this.state;
    const socket = socketIOClient(socketURL);

    socket.on('connect', () => {
      //console.log(this.state);            
      this.newGame(socket);    
    });

    socket.on("started", data => console.log(data));
  }

  /**
   * Request API for a new game.
   */
  async newGame(socket) {    
    try {
      let players = { [this.state.player]: socket.id };
      this.setState({ players });
      
      let { name, marker, player, next } = this.state;      
      console.log({ 
        name, marker, player, next, players
      });

      const res = await axios.post(`${config.api.URL}/games`, { 
        name, marker, player, next, players
      }); 
      socket.emit('joined', { _id: res.data._id, players });      
      
    } catch (error) {
      console.error(error);
    }
  }


  render() {    
    return (    
      <div>
        <h2>Your marker: {this.state.marker}</h2>
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