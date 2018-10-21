import React, { Component } from "react";
import "./Home.css";

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Tic Tac Toe</h1>
          <p>A simple game app</p>
        </div>
      </div>
    );
  }
}