/**
 * Created by bao.nguyen on Sat, Oct, 20
 */
'use strict';

const Game = require('../models/game'); 

module.exports = {
  newGame,
  getGames,
  getOneGame,
  updateGameInfo,
};

/**
 * POST /games
 * This request will create a new game on db.
 * @param {*} req 
 * @param {*} res 
 */
function newGame(req, res) {
  let game = new Game(req.swagger.params.Game.value);
  game.save()
    .then(() => {
      res.json(game);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ 
          message: 'Internal Server Error'
      });  
    });
}
/**
 * GET /games
 * This request will return a list of games stored inside db
 * @param {*} req 
 * @param {*} res 
 */
function getGames(req, res) {
  Game.find().sort({ createdAt: -1 }).exec()
  .then((doc) => {
    res.json(doc);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({
      message: 'Internal Server Error'
    });
  });
}
/**
 * GET /games/{id}
 * This request will return a specific game stored inside db 
 * @param {*} req 
 * @param {*} res 
 */
function getOneGame(req, res) {
  let _id = req.swagger.params.id.value;
  Game.findOne({ _id }).exec()
    .then((doc) => {
      if (!doc) {
        return res.json({});
      }
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: 'Internal Server Error'
      });
    });
}
/**
 * PUT /games/{id}
 * This request will update information of a specific game.
 * @param {*} req 
 * @param {*} res 
 */
function updateGameInfo(req, res) {
  let _id = req.swagger.params.id.value;
  let game = req.swagger.params.Game.value;
  //delete game._id;
  console.log(game);
  Game.findOneAndUpdate({ _id }, game).exec()
    .then((doc) => {
      console.log(doc);
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ 
        message: 'Internal Server Error'
      });  
    });
}
