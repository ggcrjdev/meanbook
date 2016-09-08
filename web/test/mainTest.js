"use strict";
var tests = [];
for (var file in window.__karma__.files) {
  if (/.Test\.js$/.test(file)) {
    tests.push(file);
  }
}
require.config({
  // Karma serves files from '/base'
  baseUrl: '/base/web/src/',
  paths: {
    jquery: '../lib/jquery/dist/jquery',
    angular: '../lib/angular/angular',
    angularRoute: '../lib/angular-route/angular-route',
    bootstrap: '../lib/bootstrap/dist/js/bootstrap',

    angularMocks: '../lib/angular-mocks/angular-mocks'
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
