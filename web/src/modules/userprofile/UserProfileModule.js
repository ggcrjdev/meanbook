"use strict";
require([
  'angular'], 
function(angular) {
  var moduleName = 'userProfileModule';
  var deps = ['ngRoute'];
  var module = angular.module(moduleName, deps);
  module.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $routeProvider.when('/user-profile', {
        templateUrl: 'modules/userprofile/views/UserProfile.html'
      }).when('/user-profile-edit', {
        templateUrl: 'modules/userprofile/views/UserProfileEdit.html'
      });
    }
  ]);
});
