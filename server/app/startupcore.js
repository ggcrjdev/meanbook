"use strict";
var config = require('./config');
var express = require('express');
var errorhandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
var http = require('http').Server(app);

// Logging configuration.
var log = require('./startuplog');
app.use(log.morganLogger('[:serverDateFormat] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));

// Express configuration.
// CORS
var allowCors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', config.express.origins);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token');
  next();
};
app.use(allowCors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Session configuration using Mongo store. 
// Will provide application scalability, even if a session scope is used.
var mongoose = require('mongoose');
var MongodbSessionStore = require('connect-mongo')(session);
app.use(session({
  secret: 'voandoalto-8825',
  resave: false,
  saveUninitialized: true,
  store: new MongodbSessionStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    secure: false
  }
}));

console.log('App configured using NODE_ENV ' + process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
  console.log('Enabled the middleware errorhandler.');
}

// Say to express that the web directory contains the static contents.
app.use(express.static(__dirname + '/../../web'));

// Listen to configured post.
app.set('port', (process.env.PORT || config.express.port));
http.listen(app.get('port'), function() {
  console.log('App listening on *:' + config.express.port);
});

module.exports = {
  express: express,
  app: app,
  http: http
};
