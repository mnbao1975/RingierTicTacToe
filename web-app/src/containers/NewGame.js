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
      socketURL: config.socket.URL
    };
  }

  componentDidMount() {
    //console.log(this.props.player);
    const { socketURL } = this.state;
    const socket = socketIOClient(socketURL);

    socket.on('connect', () => {
      //console.log('Connected');      
      this.newGame(socket);    
    });

    socket.on("started", data => console.log(data));
  }

  /**
   * Request API for a new game.
   */
  async newGame(socket) {
    try {
      let players = { [this.props.player]: socket.id };
      const res = await axios.post(`${config.api.URL}/games`, {
        name: 'Game R_' + Math.floor(Math.random() * 1000) + 1,
        players
      }); 
      socket.emit('joined', { _id: res.data._id, players });

      this.setState({ gameData: { players }});
    } catch (error) {
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