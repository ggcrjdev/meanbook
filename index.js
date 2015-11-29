var serverBaseDir = './server';
var config = require(serverBaseDir + '/config');
var serverModule = require(serverBaseDir + '/server');
var FrontController = require(serverBaseDir + '/frontcontroller').FrontController;
var frontController = new FrontController(serverModule.socketIO);

serverModule.http.listen(config.express.port, function() {
  console.log('HTTP Server listening on *:' + config.express.port);
});
