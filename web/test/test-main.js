"use strict";
require.config({
  baseUrl: '/base/web',
  callback: window.__karma__.start,
  paths: {
    angular: 'bower_components/angular/angular',
    angularRoute: 'bower_components/angular-route/angular-route',
    angularMocks: 'bower_components/angular-mocks/angular-mocks'
  },
  shim: {
    angular: {exports: 'angular'},
    angularRoute: {deps: ['angular']},
    angularMocks: {deps: ['angular']}
  },
  deps: ['test/app.filter.formatTimestamp.js']
});
