"use strict";
process.title = 'meanbook-app';
console.log('Starting app...');
var serverBaseDir = './app';

var config = require(serverBaseDir + '/config');
require(serverBaseDir + '/startuplog');
require(serverBaseDir + '/startupdb');
var core = require(serverBaseDir + '/startupcore');

console.log('Initializing Restful API configured to use the following baseUrl: ' + config.express.apiBaseUri);
var RestfulApi = require(serverBaseDir + '/restfulapi').RestfulApi;
var restfulApi = new RestfulApi(core.express, config.express.apiBaseUri);
restfulApi.useRouters(core.app);
console.log('App started.');
