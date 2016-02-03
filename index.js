var serverBaseDir = './server';
var config = require(serverBaseDir + '/config');
var server = require(serverBaseDir + '/server');

// restful api
var restfulApi = require(serverBaseDir + '/restfulapi')(server.express, config.express.apiBaseUri);
restfulApi.useRouters(server.app);

server.http.listen(config.express.port, function() {
  console.log('HTTP Server listening on *:' + config.express.port);
});
