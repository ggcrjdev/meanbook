define([], function() {
  function meanBookController($scope, messageService, userService, onlineUsersService, timelineService) {
    $scope.user = userService.entity;
    $scope.messageManager = messageService.entity;

    $scope.switchToHome = function() {
      timelineService.switchTimeline(userService.entity.username);
    };
    $scope.login = function() {
      var that = this;
      userService.login(that.formUserUsername, function(responseData) {
        onlineUsersService.startPulling();
        timelineService.loadPosts(that.formUserUsername);
        that.formUserUsername = null;
      });
    };
    $scope.logout = function() {
      userService.logout(function(responseData) {
        onlineUsersService.stopPulling();
      });
    };
  }

  /*** Export ***/
  return {
    meanBookController: meanBookController
  };
});
