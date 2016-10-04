"use strict";
define([
  'angular'], 
function(angular) {
  var deps = ['ngRoute'];
  var module = angular.module('userProfileModule', deps);
  
  module.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $routeProvider.when('/user-profile', {
        templateUrl: 'modules/userprofile/views/UserProfile.html'
      }).when('/user-profile-edit', {
        templateUrl: 'modules/userprofile/views/UserProfileEdit.html'
      });
    }
  ]);
  return module;
});
