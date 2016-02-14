require(['angular', 'appservices', 'appcontrollers'], function(angular, appservices, appcontrollers) {
  var mainApp = angular.module("mainApp", []);
  mainApp.value('meanBookApiUrl', getCurrentHostName() + '/api/1.0');
  mainApp.value('defaultLoadUsersTimeout', 10 * 1000);
  
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
      throw Error('currentHostName não foi encontrado.');
    }
    return host;
  };
});
