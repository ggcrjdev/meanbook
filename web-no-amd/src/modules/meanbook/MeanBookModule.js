'use strict';
var app = {
  getCurrentHostName: function() {
    var host;
    if (window.location.host) {
      host = window.location.protocol + '//' + window.location.host;
    } else if (document.URL) {
      var parser = document.createElement('a');
      parser.href = document.URL;
      host = parser.protocol + '//' + parser.host;
    } else {
      throw Error('currentHostName not found.');
    }
    return host;
  }
};

angular.module('meanBookModule',
    ['timelineModule', 'userProfileModule', 'ngRoute'])
  .config(function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    
    $routeProvider.when('/loading', {
      templateUrl: 'modules/meanbook/views/Loading.html'
    });
    console.log('[Angular]: Config block executed.');
  })

  // Configuration for the Spring Restful API on Wildfly (Java Server).
  // .value('meanBookApiUrl', 'http://localhost:8080/meanbook-spring');
  // Configuration for the DOT.NET Web API Restful API on IIS (DOT.NET Server).
  // .value('meanBookApiUrl', 'http://localhost:52654/api');
  .value('meanBookApiUrl', app.getCurrentHostName() + '/api/1.0')
  .value('defaultLoadUsersTimeout', 15 * 1000);
