'use strict';
var config = require('./config');
var consoleStamp = require('console-stamp');
var morganLogger = require('morgan');

// Definition of the timestamp on logger and console.
consoleStamp(console, config.express.timestampFormat);
morganLogger.format('serverDateFormat', function() {
  return new Date().toISOString();
});

module.exports = {
  morganLogger: morganLogger
};
