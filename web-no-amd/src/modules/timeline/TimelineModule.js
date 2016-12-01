'use strict';
angular.module('timelineModule', ['ngRoute'])
  .config(function($locationProvider, $routeProvider) {
      $routeProvider.when('/timeline', {
        templateUrl: 'modules/timeline/views/Timeline.html'
      }).otherwise('/timeline');
    }
  )
  .run(function($rootScope, 
      $location, 
      userService, 
      onlineUsersService, 
      timelineService) {
    $location.path('/loading');
    userService.loadCurrentUser(function(responseData) {
      if (responseData) {
        onlineUsersService.startPulling();
        timelineService.loadFirstPosts(userService.entity.username);
        console.log('[timeline]: Loaded posts.');
      }
      $location.path('/timeline');
    });
  });
