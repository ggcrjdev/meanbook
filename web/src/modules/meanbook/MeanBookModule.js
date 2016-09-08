"use strict";
require([
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
    meanBookController) {
  var deps = ['timelineModule', 'userProfileModule', 'ngRoute'];
  var moduleName = 'meanBookModule';
  var module = angular.module(moduleName, deps);

  // Configuration for Spring Restful API on Wildfly (Java Server).
  // module.value('meanBookApiUrl', 'http://localhost:8080/meanbook-spring');
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

  angular.element(document).ready(function() {
    angular.bootstrap(document, [moduleName]);
    console.log('[Angular]: Bootstrapped.');
  });
});
