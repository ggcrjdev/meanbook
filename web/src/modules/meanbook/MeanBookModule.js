'use strict';
define([
  'jquery', 
  'angular', 
  'angularRoute', 
  'modules/meanbook/services/MeanBookApi', 
  'modules/meanbook/services/MessageService', 
  'modules/meanbook/services/UserService', 
  'modules/meanbook/services/DateUtils', 
  'modules/meanbook/services/HttpUtils', 
  'modules/meanbook/controllers/MeanBookController', 
  'modules/timeline/TimelineModule', 
  'modules/userprofile/UserProfileModule', 
  'bootstrap'], 
function($, 
    angular, 
    ngRoute, 
    meanBookApi, 
    messageService, 
    userService, 
    dateUtils, 
    httpUtils, 
    meanBookController,
    timelineModule,
    userProfileModule) {
  var deps = ['timelineModule', 'userProfileModule', 'ngRoute'];
  var module = angular.module('meanBookModule', deps);

  // Configuration for the Spring Restful API on Wildfly (Java Server).
  // module.value('meanBookApiUrl', 'http://localhost:8080/meanbook-spring');
  // Configuration for the DOT.NET Web API Restful API on IIS (DOT.NET Server).
  // module.value('meanBookApiUrl', 'http://localhost:52654/api');
  module.value('meanBookApiUrl', httpUtils.getCurrentHostName() + '/api/1.0');
  module.value('defaultLoadUsersTimeout', 15 * 1000);

  module.service('meanBookApi', meanBookApi);
  module.service('messageService', messageService);
  module.service('userService', userService);

  module.filter('formatTimestamp', function() {
    return dateUtils.formatTimestamp;
  });
  module.filter('formatLocalDate', function() {
    return dateUtils.formatLocalDate;
  });

  module.controller('meanBookController', meanBookController);

  module.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      
      $routeProvider.when('/loading', {
        templateUrl: 'modules/meanbook/views/Loading.html'
      });
      console.log('[Angular]: Config block executed.');
    }
  ]);

  module.init = function() {
    angular.element(document).ready(function() {
      try {
        angular.bootstrap(document, [module.name]);
        console.log('[Angular]: Bootstrapped.');
      } catch (e) {
        console.error(e.stack || e.message || e);
      }
    });
  };
  return module;
});
