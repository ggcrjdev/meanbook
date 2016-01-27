require(['angular'], function(angular) {
  /*********MODULO DA APLICAÇÃO**********/
  var meanBook = angular.module("meanBook");
  meanBook.service('meanBookApi', ['$http', function($http) {

    var apiUrl = "http://localhost:3000/api/1.0";
    var urlsByMethod = {
      userLogin: this.apiUrl + '/users/login',
      userLogout: this.apiUrl + '/users/logout',
      listPosts: this.apiUrl + '/posts/list',
      makePost: this.apiUrl + '/posts/add',
      likePost: this.apiUrl + '/posts/like',
      makeComment: this.apiUrl + '/comments/add',
      likeComment: this.apiUrl + '/comments/like'
    };

    function userLogin(username, password) {
      var data = {
        username: username,
        password: password
      };
      return doPostRequest('userLogin', data);
    };

    function userLogout(username) {
      var data = {
        username: username
      };
      return doPostRequest('userLogout', data);
    };

    function listPosts(username) {
      var data = {
        username: username
      };
      return doGetRequest('listPosts', data);
    };

    function makePost(post) {};

    function likePost(likeData) {};

    function makeComment(comment) {};

    function likeComment(likeData) {};

    function doGetRequest(methodName, data, callbackSuccess, callbackError) {
      return doRequest(methodName, 'GET', data, callbackSuccess, callbackError);
    };

    function doPostRequest(methodName, data, callbackSuccess, callbackError) {
      return doRequest(methodName, 'POST', data, callbackSuccess, callbackError);
    };

    function doRequest(methodName, httpMethod, data, callbackSuccess, callbackError) {
      var requestUrl = this.urlsByMethod[methodName];
      if (!requestUrl) {
        throw Exception("O nome do método" + methodName + " não possui uma URL mapeada.");
      }
      if (!httpMethod) {
        httpMethod = 'POST';
      }
      if (!data) {
        data = {};
      }
      if (!callbackSuccess) {
        callbackSuccess = function(data) {};
      }

      return $http({
        method: httpMethod,
        url: requestUrl,
        data: data
      }).success(callbackSuccess);
    };

    return {
      login: userLogin,
      logout: userLogout,
      listPosts: listPosts,
      makePost: makePost,
      likePost: likePost,
      makeComment: makeComment,
      likeComment: likeComment
    };
  }]);

  require(['controllers'], function(controllers) {});
});
