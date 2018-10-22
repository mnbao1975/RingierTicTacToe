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
  // Handeling player joining to the game
  client.on("joined", data => {
    joinGame(client, data);
  });
  // Handeling restarting game
  client.on("restarted", data => {
    restartedGame(client, data);
  });
  // Handeling palyer's move
  // Each move will be checked for winner also.
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
  const { players, marker, player } = data;

  games = Object.assign(games, {[`${gameId}`]: { players }});
  games[gameId].state = 'NEW';

  client.to(gameId).emit('joined', {...data, socketId: client.id});
  const res = await axios.put(`${config.apiURL}/games/${gameId}`, { players, marker, player });
  
  // Game will be started whenever there are 2 joined players.
  if (Object.keys(games[gameId].players).length == 2) {  
    console.log('Game started');
    io.in(gameId).emit('started', {state: 'STARTED'});
    client.emit('started', {state: 'STARTED'}); // Ensure the sender will receive it too.
    games[gameId].state = 'STARTED';
    const res = await axios.put(`${config.apiURL}/games/${gameId}`, {
      state: 'STARTED'
    });

    // Testing
    io.emit('started', games[gameId]);      
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
  //const { moves, next, player } = data;
  const moves = data.moves;
  const next = data.next;
  const player = data.player;

  games[gameId].moves = moves;
  games[gameId].next = next;

  let winner = calculateWinner(moves);
  if (winner) {
    games[gameId].state = 'COMPLETED';
    // Ensure current player knows that he is the winner
    client.emit('moved', { ...data, winner, state: games[gameId].state });
  }
  
  const res = await axios.put(`${config.apiURL}/games/${gameId}`, {
    player,
    moves, 
    next,
    winner,
    state: games[gameId].state
  });

  client.to(gameId).emit('moved', { ...data, winner, state: games[gameId].state });  
}
/**
 * Calculate which marker (X|O)  is the winner
 * @param {*} moves 
 */
function calculateWinner(moves) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (moves[a] && moves[a] === moves[b] && moves[a] === moves[c]) {
      return moves[a];
    }
  }
  return '';
}