'use strict';
angular.module('timelineModule')
  .controller('timelineController', function($scope, 
      userService, 
      onlineUsersService, 
      timelineService) {
    $scope.timeline = timelineService.entity;
    $scope.onlineUsers = onlineUsersService.entity;

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

    $scope.switchTimeline = function(username) {
      $scope.loadFirstPosts(username);
    };
    $scope.loadFirstPosts = function(username) {
      timelineService.loadFirstPosts(username);
    };
    $scope.loadNextPageOfPosts = function(username) {
      timelineService.loadNextPageOfPosts(username);
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
      $(window).unbind('scroll');
      $(window).bind('scroll', function() {
        if (!$scope.timeline.pagination.endOfPage &&
            '#!/timeline' === $(location).attr('hash') &&
            $(window).scrollTop() + window.innerHeight == $(document).height()) {
          $scope.loadNextPageOfPosts();
        }
      });
    };
    $scope.loadPostsOnUserScrollsBottom();
  });
