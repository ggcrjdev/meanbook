var config = require('./config');
var mongoose = require('mongoose');

// Connection configurations.
var mongooseOptions = {
  user: config.mongodb.user,
  pass: config.mongodb.password,
  server: {
    auto_reconnect: config.mongodb.autoReconnect,
    poolSize: config.mongodb.connectionPoolSize,
    socketOptions: config.mongodb.socketOptions
  },
  replset: {
    socketOptions: config.mongodb.socketOptions
  }
};

// Connecting.
var isMongooseConnectedBefore = false;
var mongooseConnect = function() {
  console.log('Connecting to the mongodb on url ' + config.mongodb.url);
  mongoose.connect(config.mongodb.url, mongooseOptions);
};
mongooseConnect();

// Connection events.
mongoose.connection.on('error', function() {
  console.log('Mongoose default connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose default connection disconnected');
  if (!isMongooseConnectedBefore) {
    mongooseConnect();
  }
});
mongoose.connection.on('connected', function() {
  isMongooseConnectedBefore = true;
  console.log('Mongoose default connection open to ' + config.mongodb.url);
});
mongoose.connection.on('reconnected', function() {
  console.log('Mongoose default connection reconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});