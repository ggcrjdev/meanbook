require(['angular', 'appservices', 'appcontrollers'], function(angular, appservices, appcontrollers) {
  var mainApp = angular.module("mainApp", []);
  mainApp.value('meanBookApiUrl', 'http://localhost:3000/api/1.0');
  mainApp.service('meanBookApi', appservices.meanBookApi);
  mainApp.controller('meanBookController', appcontrollers.meanBookController);
});
