"use strict";
var mongodbUrl = 'mongodb://localhost:27017/meanbook';
if (process.env.NODE_ENV === 'production') {
  mongodbUrl = 'mongodb://ds061385.mongolab.com:61385/heroku_8b3ctgjk';
}

var config = {
  express: {
    port: 3000,
    origins: '*',
    timestampFormat: 'HH:MM:ss.l',
    apiBaseUri: '/api/1.0'
  },
  mongodb: {
    url: mongodbUrl,
    user: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    autoReconnect: true,
    connectionPoolSize: 5,
    socketOptions: {
      keepAlive: 120
    }
  }
}

module.exports = config;
