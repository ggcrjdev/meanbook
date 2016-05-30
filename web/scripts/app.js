require([
  'jquery', 
  'angular', 
  'appservices', 
  'appcontrollers', 
  'apputils', 
  'bootstrap'], 
function($, angular, appservices, appcontrollers, AppUtils) {
  var mainApp = angular.module('mainApp', []);
  // Configuration for Spring Restful API on Wildfly (Java Server).
  // mainApp.value('meanBookApiUrl', 'http://localhost:8080/meanbook-spring');
  mainApp.value('meanBookApiUrl', AppUtils.getCurrentHostName() + '/api/1.0');
  mainApp.value('defaultLoadUsersTimeout', 15 * 1000);
  
  mainApp.service('meanBookApi', appservices.meanBookApi);
  mainApp.controller('meanBookController', appcontrollers.meanBookController);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['mainApp']);
  });
});
