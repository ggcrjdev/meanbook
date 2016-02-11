define([], function() {
  function meanBookController($scope, $timeout, meanBookApi) {
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
  }

  /*** Exportação dos controladores disponíveis. ***/
  return {
    meanBookController: meanBookController
  };
});
