define([], function() {
  function meanBookApi($http, meanBookApiUrl) {
    var apiUrl = meanBookApiUrl;
    var urlsByMethod = {
      login: apiUrl + '/users/login',
      logout: apiUrl + '/users/logout',
      listUsers: apiUrl + '/users/list',
      listPosts: apiUrl + '/posts/list',
      makePost: apiUrl + '/posts/add',
      likePost: apiUrl + '/posts/like',
      makeComment: apiUrl + '/comments/add',
      likeComment: apiUrl + '/comments/like'
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
    function listUsers() {
      return doGetRequest('listUsers');
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
    function doGetRequest(methodName, data, callbackSuccess, callbackError) {
      return doRequest(methodName, 'GET', data, callbackSuccess, callbackError);
    };

    function doPostRequest(methodName, data, callbackSuccess, callbackError) {
      return doRequest(methodName, 'POST', data, callbackSuccess, callbackError);
    };

    function doRequest(methodName, httpMethod, data, callbackSuccess, callbackError) {
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
      if (!callbackSuccess) {
        callbackSuccess = function(dataSuccess) {};
      }

      return $http({
        method: httpMethod,
        url: requestUrl,
        data: data
      }).success(callbackSuccess);
    };

    return {
      login: login,
      logout: logout,
      listUsers: listUsers,

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
