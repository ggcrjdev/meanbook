require(['angular', 'apiFacade'], function(angular, apiFacade) {

  /*********FUNÇÕES UTEIS**********/
  function formatHour(timestamp) {
    var today = new Date(timestamp);
    var formattedDate = (today.getHours() < 10) ? '0' : '';
    formattedDate += today.getHours() + ':';
    formattedDate += (today.getMinutes() < 10) ? '0' : '';
    formattedDate += today.getMinutes() + '';
    return formattedDate;
  }

  /*********MODULO DA APLICAÇÃO**********/
  var meanBook = angular.module("meanBook", []);
  meanBook.value("apiUrl", "http://localhost:3000/api/1.0");
  meanBook.service('apiFacade', function($http, apiUrl) {
    apiFacade.init($http, apiUrl);
    return apiFacade;
  });

  /*********MODULO DO CONTROLADOR**********/
  meanBook.controller("meanBookController", function($scope, apiFacade) {
    $scope.onlineUsers = [];
    $scope.user = {
      posts: []
    };
  });
});