require(['angular', 'appservices', 'appcontrollers'], function(angular, appservices, appcontrollers) {
  var mainApp = angular.module('mainApp', []);
  // Configuration for Spring Restful API on Wildfly (Java Server).
  // mainApp.value('meanBookApiUrl', 'http://localhost:8080/meanbook-spring');
  mainApp.value('meanBookApiUrl', getCurrentHostName() + '/api/1.0');
  mainApp.value('defaultLoadUsersTimeout', 15 * 1000);
  
  mainApp.service('meanBookApi', appservices.meanBookApi);
  mainApp.controller('meanBookController', appcontrollers.meanBookController);

  function getCurrentHostName() {
  	var host;
    if (window.location.host) {
      host = window.location.protocol + '//'+ window.location.host;
    } else if (document.URL) {
      var parser = document.createElement('a');
      parser.href = document.URL;
      host = parser.protocol + '//'+ parser.host;
    } else {
      throw Error('currentHostName not found.');
    }
    return host;
  };
});
