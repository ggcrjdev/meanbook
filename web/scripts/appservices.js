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
    function logout() {
      return doPostRequest('logout');
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

    /***** Metodo uteis para efetuar requisições HTTP *****/
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
      }
      if (!httpMethod) {
        httpMethod = 'POST';
      }
      if (!data) {
        data = {};
      }
      if (!successCallback) {
        successCallback = requestSuccessCallback;
      }
      if (!errorCallback) {
        errorCallback = requestErrorCallback;
      }

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

  /*** Exportação dos serviços disponíveis. ***/
  return {
    meanBookApi: meanBookApi
  };
});
