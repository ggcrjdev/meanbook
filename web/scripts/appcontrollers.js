define([], function() {
  function meanBookController($scope, $timeout, $interval, meanBookApi, defaultLoadUsersTimeout) {
    var loadUsersTimer;
    
    $scope.messages = [];
    $scope.onlineUsers = [];
    $scope.user = {
      username: null,
      posts: [],

      loggedIn: function() {
        return this.username != null;
      }
    };
    $scope.login = function() {
      meanBookApi.login($scope.formUserUsername).then(function(response) {
        authenticateUser(response.data.username);
        $scope.formUserUsername = null;
      }, errorHandling);
    };
    $scope.logout = function() {
      meanBookApi.logout($scope.user.username).then(function(response) {
        $scope.onlineUsers = new Array();
        $scope.user.username = null;
        $scope.user.posts = [];
        stopPullingOnlineUsers();
      }, errorHandling);
    };

    $scope.makePost = function() {
      meanBookApi.makePost($scope.formPostContent).then(function(response) {
        loadPostsForCurrentUser();
        $scope.formPostContent = null;
      }, errorHandling);
    };
    $scope.likePost = function(postId) {
      meanBookApi.likePost(postId).then(function(response) {
        loadPostsForCurrentUser();
      }, errorHandling);
    };

    $scope.cancelComment = function() {
      this.formCommentContent = null;
    };
    $scope.makeComment = function(postId) {
      meanBookApi.makeComment(this.formCommentContent, postId).then(function(response) {
        loadPostsForCurrentUser();
        $scope.formCommentContent = null;
      }, errorHandling);
    };
    $scope.likeComment = function(commentId, postId) {
      meanBookApi.likeComment(commentId, postId).then(function(response) {
        loadPostsForCurrentUser();
      }, errorHandling);
    };


    /*********Private functions**********/
    function loadCurrentUser() {
      meanBookApi.currentUser().then(function(response) {
        if (response.data.authenticated) {
          authenticateUser(response.data.username);
        }
      }, errorHandling);
    };
    function authenticateUser(currentUsername) {
      $scope.user.username = currentUsername;
      loadOnlineUsers();
      loadPostsForCurrentUser();
      startPullingOnlineUsers();
    };
    function loadOnlineUsers() {
      meanBookApi.listUsers().then(function(response) {
        $scope.onlineUsers = response.data.users;
      }, errorHandling);
    };
    function loadPostsForCurrentUser() {
      meanBookApi.listPosts($scope.user.username).then(function(response) {
        $scope.user.posts = response.data.posts;
      }, errorHandling);
    };

    function errorHandling(response) {
      if (response.data && response.data.type === 'error') {
        $scope.messages.push(response.data);
        $timeout(clearMessages, defaultLoadUsersTimeout);
      }
    };
    function clearMessages() {
      $scope.messages = [];
    };

    function startPullingOnlineUsers() {
      this.loadUsersTimer = $interval(loadOnlineUsers, defaultLoadUsersTimeout);
    };
    function stopPullingOnlineUsers() {
      if (this.loadUsersTimer) {
        $interval.cancel(this.loadUsersTimer);
      }
    };


    /*********Utilities functions**********/
    $scope.formatTimestamp = function(timestamp) {
      var dateToFormat = new Date(timestamp);
      var formattedDate = dateToFormat.toISOString();
      return formattedDate.replace('T', ' ').split('.')[0];
    };

    /* Startup */
    loadCurrentUser();
  }

  /*** Exports the services available ***/
  return {
    meanBookController: meanBookController
  };
});
