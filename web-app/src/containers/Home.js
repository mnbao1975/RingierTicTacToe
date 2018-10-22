import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import axios from "axios";

import config from "../config";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {      
      games: []
    };
  }

  async componentDidMount() {
    console.log(this.props.player);
    try {
      const res = await this.games();
      this.setState({ games: res.data });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }
  
  games() {
    return axios.get(`${config.api.URL}/games`);
  }

  renderGamesList(games) {
    return [{}].concat(games).map(
      (game, i) =>
        i !== 0
          ? <LinkContainer
              key={game._id}
              to={`/games/${game._id}`}
            >
              <ListGroupItem header={game.name.trim().split("\n")[0]}>
                {"State: " + game.state + " - Created: " + new Date(game.createdAt).toLocaleString()}
              </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/games/new"
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Create a new game
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }

  render() {
    return (
      <div className="Home">
        <div className="games">
          <PageHeader>Saved Games</PageHeader>
          <ListGroup>
            {this.renderGamesList(this.state.games)}
          </ListGroup>
      </div>
      </div>
    );
  }
}