'use strict';
process.title = 'meanbook-app';
console.log('Starting app...');
var serverBaseDir = './app';

var config = require(serverBaseDir + '/config');
var core = require(serverBaseDir + '/startupcore');
require(serverBaseDir + '/startupdb');

console.log('Initializing Restful API configured to use the following baseUrl: ' + config.express.apiBaseUri);
var api = require(serverBaseDir + '/restfulapi');
api.api(core.app, core.express);
console.log('App started.');
