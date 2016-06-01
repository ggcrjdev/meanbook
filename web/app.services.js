define([], function() {
  function meanBookApi($http, meanBookApiUrl) {
    var apiUrl = meanBookApiUrl;
    var urlsByMethod = {
      listUsers: apiUrl + '/users/list',
      currentUser: apiUrl + '/users/current',
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

    /*****Utilities functions for HTTP request/response*****/
    function doGetRequest(methodName, data, successCallback, errorCallback) {
      return doRequest(methodName, 'GET', data, successCallback, errorCallback);
    };

    function doPostRequest(methodName, data, successCallback, errorCallback) {
      return doRequest(methodName, 'POST', data, successCallback, errorCallback);
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
    var entity = {
      messages: [],
      clear: function() {
        this.messages = [];
      }
    };

    function addErrorMessage(messageData) {
      if (messageData && messageData.type === 'error') {
        entity.messages.push(messageData);
        $timeout(clearMessages, defaultLoadUsersTimeout);
      }
    };
    function errorHandling(response) {
      addErrorMessage(response.data);
    };
    function clearMessages() {
      entity.clear();
    };

    return {
      entity: entity,
      addErrorMessage: addErrorMessage,
      errorHandling: errorHandling,
      clearMessages: clearMessages
    };
  }

  function userService(messageService, meanBookApi) {
    var loadUsersTimer = null;
    var entity = {
      username: null,
      loggedIn: function() {
        return this.username != null;
      },
      clear: function() {
        this.onlineUsers = [];
        this.username = null;
      }
    };

    function login(username, callback) {
      meanBookApi.login(username).then(function(response) {
        entity.username = response.data.username;
        if (callback)
          callback(response.data);
      }, messageService.errorHandling);
    };
    function logout(callback) {
      meanBookApi.logout(entity.username).then(function(response) {
        entity.clear();
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
      login: login,
      logout: logout,
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
