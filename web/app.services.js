"use strict";
define(['angular'], function(angular) {
  function meanBookApi($http, meanBookApiUrl) {
    var apiUrl = meanBookApiUrl;
    var urlsByMethod = {
      listUsers: apiUrl + '/users/list',
      currentUser: apiUrl + '/users/current',
      saveUser: apiUrl + '/users/edit',
      login: apiUrl + '/users/login',
      logout: apiUrl + '/users/logout',
      listPosts: apiUrl + '/posts/list',
      makePost: apiUrl + '/posts/add',
      likePost: apiUrl + '/posts/like',
      makeComment: apiUrl + '/comments/add',
      likeComment: apiUrl + '/comments/like'
    };

    function listUsers() {
      return doGetRequest('listUsers');
    };
    function currentUser() {
      return doPostRequest('currentUser');
    };
    function saveUser(userData) {
      return doPutRequest('saveUser', userData);
    };
    function login(username, password) {
      var data = {
        username: username,
        password: password
      };
      return doPostRequest('login', data);
    };
    function logout(username) {
      var data = {
        username: username
      };
      return doPostRequest('logout', data);
    };

    function listPosts(username) {
      var data = {
        username: username
      };
      return doGetRequest('listPosts', data);
    };
    function makePost(postText) {
      var data = {
        text: postText
      };
      return doPostRequest('makePost', data);
    };
    function likePost(postId) {
      var data = {
        postId: postId
      };
      return doPostRequest('likePost', data);
    };

    function makeComment(commentText, postId) {
      return doPostRequest('makeComment', {
        postId: postId,
        text: commentText
      });
    };
    function likeComment(commentId, postId) {
      return doPostRequest('likeComment', {
        postId: postId,
        commentId: commentId
      });
    };

    /*** Utilities functions for HTTP request/response ***/
    function doGetRequest(methodName, data, successCallback, errorCallback) {
      return doRequest(methodName, 'GET', data, successCallback, errorCallback);
    };
    function doPostRequest(methodName, data, successCallback, errorCallback) {
      return doRequest(methodName, 'POST', data, successCallback, errorCallback);
    };
    function doPutRequest(methodName, data, successCallback, errorCallback) {
      return doRequest(methodName, 'PUT', data, successCallback, errorCallback);
    };
    function doRequest(methodName, httpMethod, data, successCallback, errorCallback) {
      var requestUrl = urlsByMethod[methodName];
      if (!requestUrl) {
        throw Error("O nome do método" + methodName + " não possui uma URL mapeada.");
      } else if (methodName == 'listPosts') {
        requestUrl += '/' + data.username;
      }
      
      if (!httpMethod)
        httpMethod = 'POST';
      if (!data)
        data = {};
      if (!successCallback)
        successCallback = requestSuccessCallback;
      if (!errorCallback)
        errorCallback = requestErrorCallback;

      return $http({
        method: httpMethod,
        url: requestUrl,
        data: data
      }).success(successCallback).error(errorCallback);
    };

    function requestSuccessCallback(data) {};
    function requestErrorCallback(err, status) {};

    return {
      listUsers: listUsers,
      currentUser: currentUser,
      saveUser: saveUser,
      login: login,
      logout: logout,

      listPosts: listPosts,
      makePost: makePost,
      likePost: likePost,
      
      makeComment: makeComment,
      likeComment: likeComment
    };
  }

  function messageService($timeout, defaultLoadUsersTimeout) {
    var clearMessagesTimer = null;
    var entity = {
      messages: [],
      clear: function() {
        this.messages = [];
      }
    };

    function addMessage(message, type, code) {
      if (!type)
        type = 'info';
      if (type !== 'error')
        code = null;

      var messageData = {
        type: type,
        text: message,
        code: code
      };
      entity.messages.push(messageData);
      if (clearMessagesTimer)
        $timeout.cancel(clearMessagesTimer);
      clearMessagesTimer = $timeout(clearMessages, defaultLoadUsersTimeout);
    };
    function addErrorMessage(message, code) {
      addMessage(message, 'error', code);
    };
    function addWarnMessage(message) {
      addMessage(message, 'warn');
    };
    function addInfoMessage(message) {
      addMessage(message, 'info');
    };
    function clearMessages() {
      entity.clear();
    };

    function errorHandling(response) {
      if (response.data && response.data.type === 'error')
        addErrorMessage(response.data.detail, response.data.code);
    };

    return {
      entity: entity,
      clearMessages: clearMessages,
      addErrorMessage: addErrorMessage,
      addWarnMessage: addWarnMessage,
      addInfoMessage: addInfoMessage,
      errorHandling: errorHandling
    };
  }

  function userService(messageService, meanBookApi) {
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

      this.loggedIn = function() {
        return this.username != null;
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
    };

    function login(username, callback) {
      meanBookApi.login(username).then(function(response) {
        entity.username = response.data.username;
        entity.firstName = response.data.firstName;
        entity.lastName = response.data.lastName;
        entity.email = response.data.email;
        if (response.data.birthday) {
          entity.birthday = new Date(response.data.birthday);
          entity.birthdayDay = response.data.birthdayDay;
          entity.birthdayMonth = response.data.birthdayMonth;
          entity.birthdayYear = response.data.birthdayYear;
        }
        if (callback)
          callback(response.data);
      }, messageService.errorHandling);
    };
    function logout(callback) {
      meanBookApi.logout(entity.username).then(function(response) {
        clearEntity();
        if (callback)
          callback(response.data);
      }, messageService.errorHandling);
    };

    function prepareSaveUser() {
      angular.copy(entity, editableEntity);
    };
    function cancelSaveUser() {
      angular.copy(emptyEntity, editableEntity);
    };
    function saveUser(callback) {
      editableEntity.birthday = new Date(editableEntity.birthdayYear, 
        editableEntity.birthdayMonth - 1, editableEntity.birthdayDay, 0, 0, 0, 0);
      meanBookApi.saveUser(editableEntity).then(function(response) {
        angular.copy(editableEntity, entity);
        if (callback)
          callback(response.data);
      }, messageService.errorHandling);
    };
    function loadCurrentUser(callback) {
      meanBookApi.currentUser().then(function(response) {
        if (response.data && response.data.authenticated) {
          login(response.data.username, callback);
        }
      }, messageService.errorHandling);
    };

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
  }

  /*** Export ***/
  return {
    meanBookApi: meanBookApi, 
    messageService: messageService, 
    userService: userService
  };
});
