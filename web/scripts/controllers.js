require(['angular'], function(angular) {
  /*********MODULO DO CONTROLADOR**********/
  var mainApp = angular.module("mainApp", []);
  mainApp.controller("meanBookController", function($scope, meanBookApi) {
    $scope.onlineUsers = new Array();
    $scope.user = {
      username: null,
      posts: [],

      loggedIn: function() {
        return this.username != null;
      }
    };

    $scope.login = function() {
      meanBookApi.login($scope.formUserUsername).then(function(data) {
        $scope.user.username = $scope.formUserUsername;
        $scope.onlineUsers.push($scope.user.username);
        loadPostsForCurrentUser();
        $scope.formUserUsername = null;
      });
    };

    $scope.makePost = function() {
      meanBookApi.makePost($scope.formPostContent).then(function(data) {});
      loadPostsForCurrentUser();
      $scope.formPostContent = null;
    };

    function loadPostsForCurrentUser() {
      meanBookApi.listPosts($scope.user.username).then(function(data) {
        $scope.user.posts = data;
      });
    };

    /*********FUNÇÕES UTEIS**********/
    $scope.formatHour = function(timestamp) {
      var today = new Date(timestamp);
      var formattedDate = (today.getHours() < 10) ? '0' : '';
      formattedDate += today.getHours() + ':';
      formattedDate += (today.getMinutes() < 10) ? '0' : '';
      formattedDate += today.getMinutes() + '';
      return formattedDate;
    };
  });
});