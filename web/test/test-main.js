"use strict";
var tests = [];
for (var file in window.__karma__.files) {
  if (/.test\.js$/.test(file)) {
    tests.push(file);
  }
}
require.config({
  // Karma serves files from '/base'
  baseUrl: '/base/web',
  paths: {
    jquery: 'bower_components/jquery/dist/jquery',
    angular: 'bower_components/angular/angular',
    angularRoute: 'bower_components/angular-route/angular-route',
    bootstrap: 'bower_components/bootstrap/dist/js/bootstrap',

    angularMocks: 'bower_components/angular-mocks/angular-mocks'
  },
  shim: {
    jquery: {exports: '$'}, 
    bootstrap: {deps: ['jquery']}, 
    angular: {exports: 'angular', deps: ['jquery']}, 
    angularRoute: {exports: 'ngRoute', deps: ['angular']},

    angularMocks: {deps: ['angular']}
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});
