define([], function() {
  return function($scope, messageService, userService) {
    $scope.user = userService.entity;
    $scope.messageManager = messageService.entity;

    $scope.switchToHome = function() {
      $scope.$broadcast('ClickedHome');
    };
    $scope.login = function() {
      var that = this;
      userService.login(that.formUserUsername, function(responseData) {
        $scope.$broadcast('LoggedIn');
        that.formUserUsername = null;
        messageService.clearMessages();
      });
    };
    $scope.logout = function() {
      userService.logout(function(responseData) {
        $scope.$broadcast('LoggedOut');
      });
    };
  };
});
