var serverBaseDir = './server';
var config = require(serverBaseDir + '/config');
var server = require(serverBaseDir + '/server');

// restful api
var RestfulApi = require(serverBaseDir + '/restfulapi').RestfulApi;
var restfulApi = new RestfulApi(server.express, config.express.apiBaseUri);
restfulApi.useRounters(server.app);

server.http.listen(config.express.port, function() {
  console.log('HTTP Server listening on *:' + config.express.port);
});
