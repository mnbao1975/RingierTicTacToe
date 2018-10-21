/**
 * Created by bao.nguyen on Sat, Oct, 20
 * For testing purpose
 * $ node client.js 
 * $ node client.js 'Player2' '5bcb7a5cd82e730b521cc3b7'
 */
'use strict';

const axios = require("axios");
const io = require('socket.io-client')
const config = require('./config/default')();

console.log(`Connecting to socket server at ${ config.socketHost }:${ config.port }`);
const socket = io.connect(`${ config.socketHost }:${ config.port }`);

const player = process.argv[2] || 'Player1';
const gameId = process.argv[3] || '0';

const marker = (player == 'Player1') ? 'X' : 'O';
/**
 * Game data schema will be save to db
 */
let gameData = {
  name: null,
  state: 'NEW',
  firstPlayerIsNext: false,
  players: null,
  moves: Array(9).fill(''), 
}
//-----------------

socket.on('connect', () => {
  console.log('Connected');
  // For testing, assume that player 1 is the one who start a new game.
  if (player == 'Player1') {
    newGame(socket);
  } else {
    joinGame(socket, gameId);
    playerMoved(gameId, 3, marker);
  }

});

socket.on('joined', data => {
  console.log('New player joined:');
  console.log(data);

  gameData.players = data.players;
});

socket.on('started', data => {
  console.log('Game STARTED:');
  console.log(data);

  gameData.state = 'STARTED'  
});

socket.on('moved', data => {
  console.log(data);

  gameData.moves = data.moves;
  gameData.firstPlayerIsNext = (data.player == 'Player2') ? true : false;
});

socket.on('restarted', data => {
  console.log(data);

  gameData.moves = Array(9).fill(null);
});

socket.on('error', err => {
  console.log('received socket error:')
  console.log(err)
});
/**
 * Request API for a new game.
 */
async function newGame(socket) {
  try {
    let players = { [`${player}`]: socket.id };
    const res = await axios.post(`${config.apiURL}/games`, {
      name: 'Game 1',
      players
    }); 
    socket.emit('joined', { _id: res.data._id, players });

    //gameData._id = res.data._id;
    gameData.players = players
  } catch (error) {
    console.error(error);
  }
}
/**
 * Join to a incompleted game (new/saved).
 * @param {*} socket 
 */
async function joinGame(socket, gameId) {
  try {
    const res = await axios.get(`${config.apiURL}/games/${gameId}`);
    let players = { ...res.data.players, [`${player}`]: socket.id };
    socket.emit('joined', { _id: gameId, joinedPlayer: player, players });

    gameData.players = players
    gameData.moves = res.data.moves;
  } catch (error) {
    console.error(error);
  }
}
/**
 * Reset the current game id
 * @param {*} socket 
 */
async function restartGame(socket, gameId) {
  try {
    const res = await axios.put(`${config.apiURL}/games/${gameId}`, {
      moves: []
    });
    socket.emit('restarted', { _id: gameId });
  } catch (error) {
    console.error(error);
  }
}
/**
 * Load a completed game
 * @param {*} socket 
 */
async function loadGame(socket, gameId) {
  try {
    const res = await axios.get(`${config.apiURL}/games/${gameId}`);
    gameData = Object.assign(gameData, res.data);
  } catch (error) {
    console.error(error);
  }
}
/**
 * Save a incompleted game
 * @param {*} gameId 
 */
async function saveGame(gameId) {
  try {
    const newGameData = Object.assign(gameData, { players: {}, state: 'SAVED' });
    const res = await axios.put(`${config.apiURL}/games/${gameId}`, newGameData);
  } catch (error) {
    console.error(error);
  }
}
function playerMoved(gameId, position, marker) {
  gameData.moves[position] = marker;
  gameData.firstPlayerIsNext = (player == 'Player2') ? true : false;
  
  socket.emit('moved', { 
    _id: gameId,
    moves: gameData.moves, 
    firstPlayerIsNext: gameData.firstPlayerIsNext, 
    player 
  });
}