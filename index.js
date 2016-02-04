var serverBaseDir = './server';
var config = require(serverBaseDir + '/config');
console.log("Inicializando server...");
var server = require(serverBaseDir + '/server');

// restful api
console.log("Inicializando restfulapi configurado para usar o prefixo de URL " + config.express.apiBaseUri);
var RestfulApi = require(serverBaseDir + '/restfulapi').RestfulApi;
var restfulApi = new RestfulApi(server.express, config.express.apiBaseUri);
restfulApi.useRouters(server.app);

server.http.listen(config.express.port, function() {
  console.log('HTTP Server listening on *:' + config.express.port);
});
