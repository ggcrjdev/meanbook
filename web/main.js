"use strict";
require.config({
  basePath: './',
  paths: {
    jquery: 'bower_components/jquery/dist/jquery.min',
    angular: 'bower_components/angular/angular.min',
    angularRoute: 'bower_components/angular-route/angular-route.min',
    bootstrap: 'bower_components/bootstrap/dist/js/bootstrap.min'
  },
  shim: {
    jquery: {exports: '$'}, 
    bootstrap: {deps: ['jquery']}, 
    angular: {exports: 'angular', deps: ['jquery']}, 
    angularRoute: {exports: 'ngRoute', deps: ['angular']}
  },
  deps: ['app.module']
});
