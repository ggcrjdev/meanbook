// Importação dos modulos necessários.
process.title = 'App Server MEANBook';
var config = require('./config');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var app = express();
var http = require('http').Server(app);

// Configuração do Mongoose - driver de MongoDB
mongoose.connect(config.mongodb.url);

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
  cookie: { secure: false }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// Diz ao Express que o diretório web contém conteúdos estáticos
app.use(express.static(__dirname + config.express.webBaseDir));

// Exporta os módulos
module.exports.http = http;
module.exports.express = express;
module.exports.app = app;
