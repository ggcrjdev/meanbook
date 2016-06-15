"use strict";
require([
  'angular', 
  'timeline/timeline.services', 
  'timeline/timeline.controller'], 
function(angular, services, controller) {
  var module = angular.module('timeline', []);
  module.service('onlineUsersService', services.onlineUsersService);
  module.service('timelineService', services.timelineService);
  module.controller('timelineController', controller);

  module.run(function($rootScope, userService, onlineUsersService, timelineService) {
    userService.loadCurrentUser(function(responseData) {
      if (responseData) {
        onlineUsersService.startPulling();
        timelineService.loadPosts(userService.entity.username);
        console.log('[timeline]: Loaded posts.');
      }
    });
  });
});
