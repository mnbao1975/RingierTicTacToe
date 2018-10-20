'use strict';

const config = {
    development: {
        mode: 'production',
        port: process.env.SOCKET_PORT || 4000,
        dbURL: process.env.DB_URL || 'mongodb://localhost:27017/tictactoe',     
    },
    production: {
        mode: 'production',
        port: process.env.SOCKET_PORT || 4000,
        dbURL: process.env.DB_URL || 'mongodb://localhost:27017/tictactoe',     
    }
};

module.exports = function (mode) { 
    return config[mode || process.env.NODE_ENV] || config.production;
};
