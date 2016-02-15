var serverBaseDir = './server';
var config = require(serverBaseDir + '/config');
console.log('Starting app...');
var server = require(serverBaseDir + '/server');

console.log('Initializing Restful API configured to use the following baseUrl: ' + config.express.apiBaseUri);
var RestfulApi = require(serverBaseDir + '/restfulapi').RestfulApi;
var restfulApi = new RestfulApi(server.express, config.express.apiBaseUri);
restfulApi.useRouters(server.app);

server.app.set('port', (process.env.PORT || config.express.port));
server.http.listen(server.app.get('port'), function() {
  console.log('App started and listening on *:' + config.express.port);
});
