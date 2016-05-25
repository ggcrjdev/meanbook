define([], function() {
  function meanBookController($scope, $timeout, $interval, meanBookApi, defaultLoadUsersTimeout) {
    var loadUsersTimer;
    
    $scope.messages = [];
    $scope.onlineUsers = [];
    $scope.user = {
      username: null,
      loggedIn: function() {
        return this.username != null;
      },
      clear: function() {
        this.username = null;
      }
    };
    $scope.timeline = {
      posts: [],
      username: null,
      isCurrentUser: function() {
        return $scope.user.username === this.username;
      },
      clear: function() {
        this.posts = [];
        this.username = null;
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
        $scope.onlineUsers = [];
        $scope.user.clear();
        $scope.timeline.clear();
        stopPullingOnlineUsers();
      }, errorHandling);
    };
    $scope.switchTimeline = function(username) {
      loadPosts(username);
    };

    $scope.makePost = function() {
      meanBookApi.makePost($scope.formPostContent).then(function(response) {
        loadPosts();
        $scope.formPostContent = null;
      }, errorHandling);
    };
    $scope.likePost = function(postId) {
      meanBookApi.likePost(postId).then(function(response) {
        loadPosts();
      }, errorHandling);
    };

    $scope.cancelComment = function() {
      this.formCommentContent = null;
    };
    $scope.makeComment = function(postId) {
      meanBookApi.makeComment(this.formCommentContent, postId).then(function(response) {
        loadPosts();
        $scope.formCommentContent = null;
      }, errorHandling);
    };
    $scope.likeComment = function(commentId, postId) {
      meanBookApi.likeComment(commentId, postId).then(function(response) {
        loadPosts();
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
      loadPosts(currentUsername);
      startPullingOnlineUsers();
    };
    function loadOnlineUsers() {
      meanBookApi.listUsers().then(function(response) {
        $scope.onlineUsers = response.data.users;
      }, errorHandling);
    };
    function loadPosts(username) {
      if (!username) {
        username = $scope.timeline.username;
      }
      meanBookApi.listPosts(username).then(function(response) {
        $scope.timeline.username = username;
        $scope.timeline.posts = response.data.posts;
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
