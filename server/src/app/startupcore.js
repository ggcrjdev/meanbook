'use strict';
var config = require('./config');
var express = require('express');
var errorhandler = require('errorhandler');
var bodyParser = require('body-parser');
var session = require('express-session');
var compression = require('compression');

var app = express();
var http = require('http').Server(app);
console.log('App configured using NODE_ENV ' + process.env.NODE_ENV);

// Logging configuration.
var log = require('./startuplog');
var pattern = '[:serverDateFormat] :method :url :status :res[content-length] - :remote-addr - :response-time ms';
app.use(log.morganLogger(pattern));

// Express configuration.
// CORS (Cross-origin resource sharing) configuration.
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', config.express.origins);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  var allowedHeaders = 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token';
  res.header('Access-Control-Allow-Headers', allowedHeaders);
  next();
});
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Session configuration using Mongo store. 
// Will provide application scalability, even if a session scope is used.
var mongoose = require('mongoose');
var MongodbSessionStore = require('connect-mongo')(session);
var sessionStore = new MongodbSessionStore({
    mongooseConnection: mongoose.connection
  }
);
app.use(session({
  name: config.express.sessionName,
  secret: config.express.sessionSecret,
  store: sessionStore,
  cookie: {
      secure: false
    },
  resave: false,
  saveUninitialized: true
}));

//  Error handling configuration.
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
  console.log('Enabled the middleware errorhandler.');
}

// Static content configuration (app sources and libraries).
var webConfig = {
  basePath: __dirname + '/../../../web/', 
  src: 'src/',
  lib: 'lib/',
  srcPath: function() {
    return this.basePath.concat(this.src);
  },
  libPath: function() {
    return this.basePath.concat(this.lib);
  }
};
if (process.env.NODE_ENV === 'production') {
  webConfig.src = 'dist/';
}
app.use(express.static(webConfig.srcPath()));
app.use('/lib', express.static(webConfig.libPath(), {
  setHeaders: function(res, path) {
    var oneMonth = 1000 * 60 * 60 * 24 * 30;
    res.header('Cache-Control', 'public, max-age=' + oneMonth);
    res.header('Expires', new Date(Date.now() + oneMonth).toUTCString());
  }
}));
console.log('webConfig.basePath: ' + webConfig.basePath);

// Configuration of the server port.
app.set('port', (process.env.PORT || config.express.port));
http.listen(app.get('port'), function() {
  console.log('App listening on *:' + config.express.port);
});

module.exports = {
  express: express,
  app: app,
  http: http
};
