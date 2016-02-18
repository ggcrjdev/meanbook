var config = require('./config');
var mongoose = require('mongoose');

// Connection configurations.
var mongooseOptions = {
  server: {
    socketOptions: config.mongodb.socketOptions
  },
  replset: {
    socketOptions: config.mongodb.socketOptions
  }
};

// Connecting.
console.log('Connecting to the mongodb on url ' + config.mongodb.url);
mongoose.connect(config.mongodb.url, mongooseOptions);

// Connection events.
mongoose.connection.on('connected', function() {
  console.log('Mongoose default connection open to ' + config.mongodb.url);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose default connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
