
const axios = require("axios");
const config = require('./config/default')();

const io = require("socket.io")(config.port);

io.on("connection", socket => {
  console.log("New client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

console.log(`Socket server is listening on port: ${ config.port }`);