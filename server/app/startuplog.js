var config = require('./config');
var consoleStamp = require('console-stamp');
var morganLogger = require('morgan');

// Definition of the timestamp on logger and console.
consoleStamp(console, config.express.timestampFormat);
var dateFormatModule = 'console-stamp/node_modules/dateformat';
try {
  console.log('Loading the module ' + require.resolve(dateFormatModule));
  morganLogger.format('serverDateFormat', function() {
    var dateFormat = require(dateFormatModule);
    return dateFormat(Date.now(), config.express.timestampFormat);
  });
  app.use(morganLogger('[:serverDateFormat] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));
} catch(e) {
  console.error('The module ' + dateFormatModule + ' not found.');
}
