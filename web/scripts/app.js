require(['angular'], function(angular) {
  /*********MODULO DA APLICAÇÃO**********/
  var mainApp = angular.module("mainApp", []);
  mainApp.service('meanBookApi', function($http) {

    var apiUrl = "http://localhost:3000/api/1.0";
    var urlsByMethod = {
      userLogin: apiUrl + '/users/login',
      userLogout: apiUrl + '/users/logout',
      listPosts: apiUrl + '/posts/list',
      makePost: apiUrl + '/posts/add',
      likePost: apiUrl + '/posts/like',
      makeComment: apiUrl + '/comments/add',
      likeComment: apiUrl + '/comments/like'
    };

    function userLogin(username, password) {
      var data = {
        username: username,
        password: password
      };
      return doPostRequest('userLogin', data);
    };

    function userLogout(username) {
      var data = {
        username: username
      };
      return doPostRequest('userLogout', data);
    };

    function listPosts(username) {
      var data = {
        username: username
      };
      return doGetRequest('listPosts', data);
    };

    function makePost(post) {
      var data = {
        text: post
      };
      return doPostRequest('makePost', data);
    };

    function likePost(likeData) {};

    function makeComment(comment) {};

    function likeComment(likeData) {};

    function doGetRequest(methodName, data, callbackSuccess, callbackError) {
      return doRequest(methodName, 'GET', data, callbackSuccess, callbackError);
    };

    function doPostRequest(methodName, data, callbackSuccess, callbackError) {
      return doRequest(methodName, 'POST', data, callbackSuccess, callbackError);
    };

    function doRequest(methodName, httpMethod, data, callbackSuccess, callbackError) {
      var requestUrl = urlsByMethod[methodName];
      if (!requestUrl) {
        throw Error("O nome do método" + methodName + " não possui uma URL mapeada.");
      }
      if (!httpMethod) {
        httpMethod = 'POST';
      }
      if (!data) {
        data = {};
      }
      if (!callbackSuccess) {
        callbackSuccess = function(data) {};
      }

      return $http({
        method: httpMethod,
        url: requestUrl,
        data: data
      }).success(callbackSuccess);
    };

    return {
      login: userLogin,
      logout: userLogout,
      listPosts: listPosts,
      makePost: makePost,
      likePost: likePost,
      makeComment: makeComment,
      likeComment: likeComment
    };
  });

  /*********MODULO DO CONTROLADOR**********/
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
      meanBookApi.login($scope.formUserUsername).then(function(response) {
        $scope.user.username = $scope.formUserUsername;
        $scope.onlineUsers.push({
          id: $scope.user.username,
          username: $scope.user.username
        });
        loadPostsForCurrentUser();
        $scope.formUserUsername = null;
      });
    };

    $scope.logout = function() {
      $scope.onlineUsers.pop($scope.user.username);
      $scope.user.username = null;
      $scope.user.posts = [];
    };

    $scope.makePost = function() {
      meanBookApi.makePost($scope.formPostContent).then(function(response) {});
      loadPostsForCurrentUser();
      $scope.formPostContent = null;
    };

    function loadPostsForCurrentUser() {
      meanBookApi.listPosts($scope.user.username).then(function(response) {
        $scope.user.posts = response.data.posts;
      });
    };

    /*********FUNÇÕES UTEIS**********/
    $scope.formatTimestamp = function(timestamp) {
      var today = new Date(timestamp);
      var formattedDate = today.getDate() + "/";
      formattedDate += (today.getMonth() + 1) + " as ";
      formattedDate += (today.getHours() < 10) ? '0' : '';
      formattedDate += today.getHours() + ':';
      formattedDate += (today.getMinutes() < 10) ? '0' : '';
      formattedDate += today.getMinutes() + '';
      return formattedDate;
    };
  });
});