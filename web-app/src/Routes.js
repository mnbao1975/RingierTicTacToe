import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Player from "./containers/Player";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/player" exact component={Player} />
  </Switch>;