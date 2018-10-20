'use strict';

const cors = require('cors');
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const mongoose = require('mongoose');
const config = require('./config/service')();

module.exports = app; // for testing

// Use native promises
mongoose.Promise = global.Promise;

config.appRoot = __dirname;
SwaggerExpress.create(config, async (err, swaggerExpress) => {
  if (err) { throw err; }

  try {
    await mongoose.connect(config.dbURL, { useNewUrlParser: true }); 
  } catch (err) {
    throw err;
  }

  //cross domain
  app.use(cors());
  // enable SwaggerUI. E.g. http://host:port/docs/
  app.use(swaggerExpress.runner.swaggerTools.swaggerUi());
  
  // install middleware
  swaggerExpress.register(app);

  app.listen(config.port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + config.port + '/hello?name=Scott');
  }
});
