import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Player.css";

export default class Player extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      palyer: '',
      marker: '',      
    };  

    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      palyer: event.target.value,
      marker: event.target.value === 'Player1' ? 'X' :'O'
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    
    alert(`You chose the ${this.state.palyer} with marker of ${this.state.marker}.`);
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="Player">      
        <form onSubmit={this.handleSubmit}>
          <h1>Select a Player:</h1>
          
          <ul>
            <li>
              <label>
                <input
                  type="radio"
                  value="Player1"
                  checked={this.state.palyer === "Player1"}
                  onChange={this.handleChange}
                />
                {    } Player 1 (X)
              </label>
            </li>
            
            <li>
              <label>
                <input
                  type="radio"
                  value="Player2"
                  checked={this.state.palyer === "Player2"}
                  onChange={this.handleChange}
                />
                {    } Player 2 (O)
              </label>
            </li>
          </ul>
          <Button
              block
              bsSize="large"            
              type="submit"
          >
          Make your choice
          </Button>
        </form>
      </div>
    );
  }
}