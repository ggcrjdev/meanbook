'use strict';
angular.module('userProfileModule', ['ngRoute'])
  .config(function($locationProvider, $routeProvider) {
      $routeProvider.when('/user-profile', {
        templateUrl: 'modules/userprofile/views/UserProfile.html'
      }).when('/user-profile-edit', {
        templateUrl: 'modules/userprofile/views/UserProfileEdit.html'
      });
    }
  );
