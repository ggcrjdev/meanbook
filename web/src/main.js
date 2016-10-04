'use strict';
require.config({
  basePath: './',
  paths: {
    jquery: '../lib/jquery/dist/jquery.min',
    angular: '../lib/angular/angular.min',
    angularRoute: '../lib/angular-route/angular-route.min',
    bootstrap: '../lib/bootstrap/dist/js/bootstrap.min'
  },
  shim: {
    jquery: {exports: '$'}, 
    bootstrap: {deps: ['jquery']}, 
    angular: {exports: 'angular', deps: ['jquery']}, 
    angularRoute: {exports: 'ngRoute', deps: ['angular']}
  },
  waitSeconds: 1,
  deps: ['main-bootstrap']
});
