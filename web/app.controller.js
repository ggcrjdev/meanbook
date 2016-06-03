"use strict";
define([], function() {
  return function($scope, $location, messageService, userService) {
    $scope.user = userService.entity;
    $scope.editableUser = userService.editableEntity;
    $scope.messageWrapper = messageService.entity;

    $scope.switchToHome = function() {
      $scope.$broadcast('ClickedHome');
    };
    $scope.login = function() {
      var that = this;
      userService.login(that.formUserUsername, function(responseData) {
        $scope.$broadcast('LoggedIn');
        that.formUserUsername = null;
        messageService.clearMessages();
        messageService.addInfoMessage('Welcome ' + responseData.username + '!');
      });
    };
    $scope.logout = function() {
      userService.logout(function(responseData) {
        $scope.$broadcast('LoggedOut');
        messageService.clearMessages();
        messageService.addInfoMessage('Bye');
      });
    };

    $scope.prepareSaveUser = function() {
      userService.prepareSaveUser();
    };
    $scope.cancelSaveUser = function() {
      userService.cancelSaveUser();
    };
    $scope.saveUser = function(form) {
      if (form.$invalid) {
        messageService.clearMessages();
        messageService.addWarnMessage('There are some fields with invalid values. Please correct them.');
      } else {
        userService.saveUser(function (responseData) {
          messageService.clearMessages();
          messageService.addInfoMessage('Saved successfully!');
          $location.path('/user-profile');
        });
      }
    };
    $scope.daysSet = function() {
      var days = [];
      for (var i = 1; i <= 31; i++) {
        days.push(i);
      }
      return days;
    };
    $scope.monthsSet = function() {
      var days = [];
      for (var i = 1; i <= 12; i++) {
        days.push(i);
      }
      return days;
    };
    $scope.yearsSet = function() {
      var days = [];
      var currentDate = new Date();
      for (var i = currentDate.getFullYear(); i >= 1900; i--) {
        days.push(i);
      }
      return days;
    };
  };
});
