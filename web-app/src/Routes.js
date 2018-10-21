import React from "react";
import { Switch } from "react-router-dom";

import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import Player from "./containers/Player";
import NewGame from "./containers/NewGame";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/player" exact component={Player} props={childProps} />
    <AppliedRoute path="/games/new" exact component={NewGame} props={childProps} />
  </Switch>;