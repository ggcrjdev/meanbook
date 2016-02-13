// Importação dos modulos necessários.
process.title = 'app-server-meanbook';
var config = require('./config');
var consoleStamp = require('console-stamp');
var morganLogger = require('morgan');
var express = require('express');
var errorhandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var app = express();
var http = require('http').Server(app);

// Definição do timestamp no logger e console.
consoleStamp(console, config.express.timestampFormat);
var dateFormatModule = 'console-stamp/node_modules/dateformat';
try {
  console.log('Carregando o módulo ' + require.resolve(dateFormatModule));
  morganLogger.format('serverDateFormat', function() {
    var dateFormat = require(dateFormatModule);
    return dateFormat(Date.now(), config.express.timestampFormat);
  });
  app.use(morganLogger('[:serverDateFormat] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));
} catch(e) {
  console.error('O módulo ' + dateFormatModule + ' não foi encontrado.');
}

// Configuração do Mongoose - driver de MongoDB
var mongooseOptions = {
  server: {
    socketOptions: {
      keepAlive: 1,
      socketTimeoutMS: config.mongodb.socketTimeout,
      connectTimeoutMS: config.mongodb.socketTimeout
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 1,
      socketTimeoutMS: config.mongodb.socketTimeout,
      connectTimeoutMS: config.mongodb.socketTimeout
    }
  }
};
console.log('Conectando ao mongodb na url ' + config.mongodb.url);
mongoose.connect(config.mongodb.url, mongooseOptions);
mongoose.connection.on('error', function() {});

// Configuração do express.
//CORS
var allowCors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', config.express.origins);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token');
  next();
};
app.use(allowCors);
app.use(session({
  secret: 'voandoalto-8825',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

console.log('Server configurado com process.env.NODE_ENV=' + process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
  console.log('Habilitado o middleware errorhandler.');
}

// Diz ao Express que o diretório web contém conteúdos estáticos
app.use(express.static(__dirname + config.express.webBaseDir));

// Exporta os módulos
module.exports = {
  express: express,
  app: app,
  http: http
};