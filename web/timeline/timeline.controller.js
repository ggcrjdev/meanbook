define([], function() {
  function timelineController($scope, userService, onlineUsersService, timelineService) {
    $scope.timeline = timelineService.entity;
    $scope.onlineUsers = onlineUsersService.entity;

    $scope.$on('LoggedIn', function() {
      onlineUsersService.startPulling();
      timelineService.loadPosts(userService.entity.username);
      console.log('[timelineController]: onLoggedIn.');
    });
    $scope.$on('LoadedCurrentUser', function() {
      onlineUsersService.startPulling();
      timelineService.loadPosts(userService.entity.username);
      console.log('[timelineController]: onLoadedCurrentUser.');
    });
    $scope.$on('ClickedHome', function() {
      timelineService.switchTimeline(userService.entity.username);
      console.log('[timelineController]: onClickedHome.');
    });
    $scope.$on('LoggedOut', function() {
      onlineUsersService.stopPulling();
      console.log('[timelineController]: onLoggedOut.');
    });

    $scope.switchTimeline = function(username) {
      timelineService.loadPosts(username);
    };
    $scope.makePost = function() {
      timelineService.makePost($scope.formPostContent, function(responseData) {
        $scope.formPostContent = null;
      });
    };
    $scope.likePost = function(postId) {
      timelineService.likePost(postId, function(responseData) {
      });
    };
    $scope.cancelComment = function() {
      this.formCommentContent = null;
    };
    $scope.makeComment = function(postId) {
      var that = this;
      timelineService.makeComment(postId, that.formCommentContent, function(responseData) {
        that.formCommentContent = null;
      });
    };
    $scope.likeComment = function(commentId, postId) {
      timelineService.likeComment(commentId, postId, function(responseData) {
      });
    };

    $scope.formatTimestamp = function(timestamp) {
      return timelineService.formatTimestamp(timestamp);
    };
  }

  /*** Export ***/
  return {
    timelineController: timelineController
  };
});
