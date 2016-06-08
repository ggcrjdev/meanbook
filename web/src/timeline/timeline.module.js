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
});
