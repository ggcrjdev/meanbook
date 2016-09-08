"use strict";
require([
  'angular', 
  'modules/timeline/services/OnlineUsersService', 
  'modules/timeline/services/TimelineService', 
  'modules/timeline/controllers/TimelineController'], 
function(angular, 
    onlineUsersService, 
    timelineService, 
    timelineController) {
  var moduleName = 'timelineModule';
  var deps = ['ngRoute'];
  var module = angular.module(moduleName, deps);
  module.service('onlineUsersService', onlineUsersService);
  module.service('timelineService', timelineService);
  
  module.controller('timelineController', timelineController);
   
  module.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $routeProvider.when('/timeline', {
        templateUrl: 'modules/timeline/views/Timeline.html'
      }).otherwise('/timeline');
    }
  ]);

  module.run(function($rootScope, 
      $location, 
      userService, 
      onlineUsersService, 
      timelineService) {
    $location.path('/loading');
    userService.loadCurrentUser(function(responseData) {
      if (responseData) {
        onlineUsersService.startPulling();
        timelineService.loadPosts(userService.entity.username);
        console.log('[timeline]: Loaded posts.');
      }
      $location.path('/timeline');
    });
  });
});
