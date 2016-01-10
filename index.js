var serverBaseDir = './server';
var config = require(serverBaseDir + '/config');
var serverModule = require(serverBaseDir + '/server');

// socket.io api
var FrontController = require(serverBaseDir + '/frontcontroller').FrontController;
var frontController = new FrontController(serverModule.socketIO);

// restful api
var RestfulApi = require(serverBaseDir + '/restfulapi').RestfulApi;
var restfulApi = new RestfulApi(serverModule.app);

serverModule.http.listen(config.express.port, function() {
  console.log('HTTP Server listening on *:' + config.express.port);
});
