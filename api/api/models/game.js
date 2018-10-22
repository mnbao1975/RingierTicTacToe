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
  marker: { type: String }, // The current marker is choosen by the first player
  player: { type: String }, // Current player just joined
  next: { type: String }, // Next marker will be in turn
  players: {},
  moves: [],
}, options);

/**
 * EXPORT MODEL
 */
module.exports = mongoose.model('games', Game);
