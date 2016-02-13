require(['angular', 'appservices', 'appcontrollers'], function(angular, appservices, appcontrollers) {
  var mainApp = angular.module("mainApp", []);
  mainApp.value('meanBookApiUrl', getCurrentHostName() + '/api/1.0');
  mainApp.value('defaultLoadUsersTimeout', 10 * 1000);
  
  mainApp.service('meanBookApi', appservices.meanBookApi);
  mainApp.controller('meanBookController', appcontrollers.meanBookController);

  function getCurrentHostName() {
	var http = location.protocol;
	var slashes = http.concat("//");
	var host = slashes.concat(window.location.host);
	return host;
  };
});
