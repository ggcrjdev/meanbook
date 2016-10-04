'use strict';
define(['jquery'], function($) {
  return function($scope, 
      userService, 
      onlineUsersService, 
      timelineService) {
    $scope.timeline = timelineService.entity;
    $scope.onlineUsers = onlineUsersService.entity;

    $scope.initialNextPageLoad = true;
    $scope.initPagination = function() {
      $scope.nextPage = 1;
      $scope.endOfPage = false;
    };
    $scope.initPagination();

    $scope.$on('LoggedIn', function() {
      onlineUsersService.startPulling();
      $scope.loadFirstPosts(userService.entity.username);
      console.log('[timelineController]: onLoggedIn.');
    });
    $scope.$on('ClickedHome', function() {
      $scope.loadFirstPosts(userService.entity.username);
      console.log('[timelineController]: onClickedHome.');
    });
    $scope.$on('LoggedOut', function() {
      onlineUsersService.stopPulling();
      console.log('[timelineController]: onLoggedOut.');
    });

    $scope.loadFirstPosts = function(username) {
      $scope.initPagination();
      $scope.loadNextPageOfPosts(username);
    };
    $scope.loadNextPageOfPosts = function(username) {
      // When the posts are loaded directly by a module, the first page already loaded.
      // In this case, the nextPage must be incremented to the next posts.
      if ($scope.initialNextPageLoad && timelineService.entity.posts.length !== 0)
        $scope.nextPage++;

      timelineService.loadPosts(username, $scope.nextPage, function(result) {
        if (result.posts.length === 0)
          $scope.endOfPage = true;
      });
      $scope.nextPage++;
      $scope.initialNextPageLoad = false;
    };
    $scope.switchTimeline = function(username) {
      $scope.loadFirstPosts(username);
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

    $scope.loadPostsOnUserScrollsBottom = function() {
      $(window).scroll(function() {
        if (!$scope.endOfPage &&
            $(window).scrollTop() + window.innerHeight == $(document).height()) {
          $scope.loadNextPageOfPosts();
        }
      });
    };
    $scope.loadPostsOnUserScrollsBottom();
  };
});
