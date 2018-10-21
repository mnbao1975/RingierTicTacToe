/**
 * Created by bao.nguyen on Sat, Oct, 20
 */
'use strict';

const axios = require("axios");
const _ = require("lodash");
const config = require('./config/default')();

const http = require("http").createServer();
const io = require("socket.io")(http);

/**
 * Store all games in memory for faster processing
 */
let games = {}; 

io.on("connection", client => {
  console.log("Player connected");

  client.on("joined", data => {
    joinGame(client, data);
  });

  client.on("restarted", data => {
    restartedGame(client, data);
  });

  client.on("moved", (data) => {
    playerMoved(client, data);        
  });

  client.on("disconnect", () => {    
    //console.log("Client disconnected");
    io.emit('disconnected', client.id);
  });
});

http.listen(config.port, () => {
  console.log(`Socket server is listening on port: ${ config.port }`);
});
/**
 * Player joins to a game room (_id)
 * The game will be started whenever there are 2 players in the room
 * @param {*} client 
 * @param {*} data 
 */
async function joinGame(client, data) {
  const gameId = data._id;
  const players = data.players;

  games = Object.assign(games, {[`${gameId}`]: { players }});
  client.to(gameId).emit('joined', {...data, socketId: client.id});
  const res = await axios.put(`${config.apiURL}/games/${gameId}`, {
    players
  });
  
  // Game will be started whenever there are 2 joined players.
  if (Object.keys(games[gameId].players).length == 2) {  
    console.log('Game started');
    io.in(gameId).emit('started', 'The game starts now.');
    games[gameId].state = 'STARTED';
    const res = await axios.put(`${config.apiURL}/games/${gameId}`, {
      state: 'STARTED'
    });  
  }
  console.log(games);
  client.join(gameId); //join game (_id)
}
/**
 * A client wanted to restarted a game room
 * @param {*} client 
 * @param {*} data 
 */
function restartedGame(client, data) {
  const gameId = data._id;
  games[gameId].moves = [];
  client.to(gameId).emit('restarted', { _id: gameId });
}
/**
 * A player moved
 * @param {*} client 
 * @param {*} data 
 */
async function playerMoved(client, data) {  
  const gameId = data._id;
  const moves = data.moves;
  const firstPlayerIsNext = data.firstPlayerIsNext;

  games[gameId].moves = moves;
  games[gameId].firstPlayerIsNext = firstPlayerIsNext;

  const res = await axios.put(`${config.apiURL}/games/${gameId}`, { moves, firstPlayerIsNext });  
  client.to(gameId).emit('moved', data);
}