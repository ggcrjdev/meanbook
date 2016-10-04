'use strict';
define(['angular'], function(angular) {
  return function(messageService, meanBookApi) {
    var User = function() {
      this.id = null;
      this.username = null;
      this.firstName = null;
      this.lastName = null;
      this.email = null;
      this.birthday = null;
      this.birthdayDay = null;
      this.birthdayMonth = null;
      this.birthdayYear = null;
      this.public = true;

      this.loggedIn = function() {
        return this.username !== null;
      };
      this.fullName = function() {
        return (this.lastName) ? this.firstName + ' ' + this.lastName : this.firstName;
      };
      this.displayName = function() {
        return this.username;
      };
    };
    var entity = new User();
    var editableEntity = new User();
    var emptyEntity = new User();
    
    function clearEntity() {
      angular.copy(emptyEntity, entity);
      angular.copy(emptyEntity, editableEntity);
    }

    function login(username, callback) {
      meanBookApi.login(username).then(function(response) {
        entity.username = response.data.username;
        entity.firstName = response.data.firstName;
        entity.lastName = response.data.lastName;
        entity.email = response.data.email;
        entity.public = response.data.public;
        if (response.data.birthday) {
          entity.birthday = new Date(response.data.birthday);
          entity.birthdayDay = response.data.birthdayDay;
          entity.birthdayMonth = response.data.birthdayMonth;
          entity.birthdayYear = response.data.birthdayYear;
        }
        if (callback)
          callback(response.data);
      }, messageService.errorHandling);
    }
    function logout(callback) {
      meanBookApi.logout(entity.username).then(function(response) {
        clearEntity();
        if (callback)
          callback(response.data);
      }, messageService.errorHandling);
    }

    function prepareSaveUser() {
      angular.copy(entity, editableEntity);
    }
    function cancelSaveUser() {
      angular.copy(emptyEntity, editableEntity);
    }
    function saveUser(callback) {
      editableEntity.birthday = new Date(editableEntity.birthdayYear, 
        editableEntity.birthdayMonth - 1, editableEntity.birthdayDay, 0, 0, 0, 0);
      meanBookApi.saveUser(editableEntity).then(function(response) {
        angular.copy(editableEntity, entity);
        if (callback)
          callback(response.data);
      }, messageService.errorHandling);
    }
    function loadCurrentUser(callback) {
      meanBookApi.currentUser().then(function(response) {
        if (response.data && response.data.authenticated)
          login(response.data.username, callback);
        else
          callback(null);
      }, messageService.errorHandling);
    }

    return {
      entity: entity,
      editableEntity: editableEntity,

      login: login,
      logout: logout,
      prepareSaveUser: prepareSaveUser,
      cancelSaveUser: cancelSaveUser,
      saveUser: saveUser,
      loadCurrentUser: loadCurrentUser
    };
  };
});
