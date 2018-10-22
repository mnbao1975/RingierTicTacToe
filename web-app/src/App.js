import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      gameId: '',
      palyer: 'Player1',
      marker: 'O',      
    };
  }
  
  chosePlayer = (palyer) => {
    this.setState({
      palyer,      
      marker: palyer === 'Player1' ? 'O' :'X'    
    });
  }

  render() {
    const childProps = {
      player: this.state.palyer,
      marker: this.state.marker,
      choosePlayer: this.choosePlayer
    };
    return (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Tic Tac Toe</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default App;
