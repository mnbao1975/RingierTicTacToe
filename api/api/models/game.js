 /**
 * Created by bao.nguyen on Sat, Oct, 20
 */
'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const options = { autoIndex: false, timestamps: true };

const Game = new Schema({
  name: { type: String },
  state: { type: String, default: 'NEW' }, //Current game's state
  firstPlayerIsNext: { type: Boolean, default: false },    
  players: {},
  moves: [],
}, options);

/**
 * EXPORT MODEL
 */
module.exports = mongoose.model('games', Game);
