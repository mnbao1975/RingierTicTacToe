/**
 * Created by bao.nguyen on Mar. 5, 2017.
 * ./models/item.js
 */

'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const options = { autoIndex: false, safe: { j: 1, w: 1, wtimeout: 60000 }, timestamps: true };

const Game = new Schema({
  name: { type: String },
  state: { type: String, default: 'NEW' }, //Current game's state
  firstPlayerIsNext: { type: Boolean, default: false },    
  players: [],
  moves: [],
}, options);

/**
 * EXPORT MODEL
 */
module.exports = mongoose.model('games', Game);
