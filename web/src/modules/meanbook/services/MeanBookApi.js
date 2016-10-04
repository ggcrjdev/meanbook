'use strict';
define(['angular'], function(angular) {
  return function($http, meanBookApiUrl) {
    var apiUrl = meanBookApiUrl;
    var urlsByMethod = {
      listUsers: apiUrl + '/users/list',
      currentUser: apiUrl + '/users/current',
      saveUser: apiUrl + '/users/edit',
      login: apiUrl + '/users/login',
      logout: apiUrl + '/users/logout',
      listPosts: apiUrl + '/posts/list/:username/:pageNumber',
      makePost: apiUrl + '/posts/add',
      likePost: apiUrl + '/posts/like',
      makeComment: apiUrl + '/comments/add',
      likeComment: apiUrl + '/comments/like'
    };

    function listUsers() {
      return doGetRequest('listUsers');
    }
    function currentUser() {
      return doPostRequest('currentUser');
    }
    function saveUser(userData) {
      return doPutRequest('saveUser', userData);
    }
    function login(username, password) {
      var data = {
        username: username,
        password: password
      };
      return doPostRequest('login', data);
    }
    function logout(username) {
      var data = {
        username: username
      };
      return doPostRequest('logout', data);
    }

    function listPosts(username, pageNumber) {
      var data = {
        username: username,
        pageNumber: pageNumber
      };
      return doGetRequest('listPosts', data);
    }
    function makePost(postText) {
      var data = {
        text: postText
      };
      return doPostRequest('makePost', data);
    }
    function likePost(postId) {
      var data = {
        postId: postId
      };
      return doPostRequest('likePost', data);
    }

    function makeComment(commentText, postId) {
      return doPostRequest('makeComment', {
        postId: postId,
        text: commentText
      });
    }
    function likeComment(commentId, postId) {
      return doPostRequest('likeComment', {
        postId: postId,
        commentId: commentId
      });
    }

    /*** Utilities functions for HTTP request/response ***/
    function doGetRequest(methodName, data, successCallback, errorCallback) {
      return doRequest(methodName, 'GET', data, successCallback, errorCallback);
    }
    function doPostRequest(methodName, data, successCallback, errorCallback) {
      return doRequest(methodName, 'POST', data, successCallback, errorCallback);
    }
    function doPutRequest(methodName, data, successCallback, errorCallback) {
      return doRequest(methodName, 'PUT', data, successCallback, errorCallback);
    }
    function doRequest(methodName, httpMethod, data, successCallback, errorCallback) {
      var requestUrl = urlsByMethod[methodName];
      if (!requestUrl)
        throw Error('O nome do método' + methodName + ' não possui uma URL mapeada.');
      
      if (!httpMethod)
        httpMethod = 'POST';
      if (!data)
        data = {};
      if (!successCallback)
        successCallback = requestSuccessCallback;
      if (!errorCallback)
        errorCallback = requestErrorCallback;

      requestUrl = addUrlPathParams(requestUrl, data);
      return $http({
        method: httpMethod,
        url: requestUrl,
        data: data
      }).success(successCallback).error(errorCallback);
    }
    function addUrlPathParams(requestUrl, requestData) {
      if (requestUrl.indexOf(':') !== -1) {
        for (var propertyName in requestData) {
          var pathParamName = ':'.concat(propertyName);
          requestUrl = requestUrl.replace(pathParamName, requestData[propertyName]);
        }
      }
      return requestUrl;
    }

    function requestSuccessCallback(data) {}
    function requestErrorCallback(err, status) {}

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
  };
});
