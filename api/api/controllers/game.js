/**
 * Created by bao.nguyen on Sat, Oct, 20
 */
'use strict';

module.exports = {
  newGame,
};


function newGame(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  // var name = req.swagger.params.name.value || 'stranger';
  // var hello = util.format('Hello, %s!', name);

  // // this sends back a JSON response which is a single string
  res.json({ message: 'Succeeded!' });
}
