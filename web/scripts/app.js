require(['angular'], function(angular) {
  /*********MODULO DA APLICAÇÃO**********/
  var mainApp = angular.module("mainApp", []);
  mainApp.service('meanBookApi', function($http) {
    var apiUrl = "http://localhost:3000/api/1.0";
    var urlsByMethod = {
      login: apiUrl + '/users/login',
      logout: apiUrl + '/users/logout',
      listUsers: apiUrl + '/users/list',
      listPosts: apiUrl + '/posts/list',
      makePost: apiUrl + '/posts/add',
      likePost: apiUrl + '/posts/like',
      makeComment: apiUrl + '/comments/add',
      likeComment: apiUrl + '/comments/like'
    };

    function login(username, password) {
      var data = {
        username: username,
        password: password
      };
      return doPostRequest('login', data);
    };
    function logout() {
      return doPostRequest('logout');
    };
    function listUsers() {
      return doGetRequest('listUsers');
    };

    function listPosts(username) {
      var data = {
        username: username
      };
      return doGetRequest('listPosts', data);
    };
    function makePost(postText) {
      var data = {
        text: postText
      };
      return doPostRequest('makePost', data);
    };
    function likePost(postId) {
      var data = {
        postId: postId
      };
      return doPostRequest('likePost', data);
    };

    function makeComment(commentText, postId) {
      return doPostRequest('makeComment', {
        postId: postId,
        text: commentText
      });
    };
    function likeComment(commentId, postId) {
      return doPostRequest('likeComment', {
        postId: postId,
        commentId: commentId
      });
    };

    /***** Metodo uteis para efetuar requisições HTTP *****/
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
        callbackSuccess = function(dataSuccess) {};
      }

      return $http({
        method: httpMethod,
        url: requestUrl,
        data: data
      }).success(callbackSuccess);
    };

    return {
      login: login,
      logout: logout,
      listUsers: listUsers,

      listPosts: listPosts,
      makePost: makePost,
      likePost: likePost,
      
      makeComment: makeComment,
      likeComment: likeComment
    };
  });

  /*********MODULO DO CONTROLADOR**********/
  mainApp.controller("meanBookController", function($scope, $timeout, meanBookApi) {
    var loadUsersTimer;
    
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
        $scope.user.username = response.data.username;
        loadOnlineUsers();
        loadPostsForCurrentUser();
        $scope.formUserUsername = null;
      });
    };
    $scope.logout = function() {
      meanBookApi.logout().then(function(response) {
        $scope.onlineUsers = new Array();
        $scope.user.username = null;
        $scope.user.posts = [];
        stopPollingOnlineUsers();
      });
    };

    $scope.makePost = function() {
      meanBookApi.makePost($scope.formPostContent).then(function(response) {
        loadPostsForCurrentUser();
        $scope.formPostContent = null;
      });
    };
    $scope.likePost = function(postId) {
      meanBookApi.likePost(postId).then(function(response) {
        loadPostsForCurrentUser();
      });
    };

    $scope.makeComment = function(postId) {
      meanBookApi.makeComment(this.formCommentContent, postId).then(function(response) {
        loadPostsForCurrentUser();
        $scope.formCommentContent = null;
      });
    };
    $scope.likeComment = function(commentId, postId) {
      meanBookApi.likeComment(commentId, postId).then(function(response) {
        loadPostsForCurrentUser();
      });
    };


    /*********FUNÇÕES PRIVADAS**********/
    function loadOnlineUsers() {
      meanBookApi.listUsers().then(function(response) {
        $scope.onlineUsers = response.data.users;
        startPollingOnlineUsers();
      });
    };

    function loadPostsForCurrentUser() {
      meanBookApi.listPosts($scope.user.username).then(function(response) {
        $scope.user.posts = response.data.posts;
      });
    };

    function startPollingOnlineUsers() {
      //this.loadUsersTimer = $timeout(loadOnlineUsers, 15000);
    };

    function stopPollingOnlineUsers() {
      if (this.loadUsersTimer) {
        //$timeout.cancel(this.loadUsersTimer);
      }
    };


    /*********FUNÇÕES UTEIS**********/
    $scope.formatTimestamp = function(timestamp) {
      var dateToFormat = new Date(timestamp);
      var formattedDate = dateToFormat.toISOString();
      return formattedDate.replace('T', ' ').split('.')[0];
    };
  });
});