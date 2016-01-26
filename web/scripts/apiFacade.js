require([], function() {

  var apiUrl = null;
  var httpService = null;
  var urlsByMethod = {};

  function init(httpService, apiUrl) {
    this.httpService = httpService;
    this.apiUrl = apiUrl;

    var urlsByMethod = {};
    urlsByMethod['userLogin'] = this.apiUrl + '/users/login';
    urlsByMethod['userLogout'] = this.apiUrl + '/users/logout';
    urlsByMethod['listPosts'] = this.apiUrl + '/posts/list';
    urlsByMethod['makePost'] = this.apiUrl + '/posts/add';
    urlsByMethod['likePost'] = this.apiUrl + '/posts/like';
    urlsByMethod['makeComment'] = this.apiUrl + '/comments/add';
    urlsByMethod['likeComment'] = this.apiUrl + '/comments/like';
    this.urlsByMethod = urlsByMethod;
  }

  function userLogin(username) {}

  function userLogout(username) {}

  function listPosts(username) {
    var data = {
      username: username
    };
    doGetRequest('listPosts', data, function(response) {
      console.log('listPosts: response: ' + response);
    });
  }

  function makePost(post) {}

  function likePost(likeData) {}

  function makeComment(comment) {}

  function likeComment(likeData) {}

  function doGetRequest(methodName, data, responseFunction) {
    this.httpService.get(this.urlsByMethod[methodName]).success(responseFunction);
  }

  function doPostRequest(methodName, data, responseFunction) {
    this.httpService.post(this.urlsByMethod[methodName]).success(responseFunction);
  }

  return {
    init: init,
    userLogin: userLogin,
    userLogout: userLogout,
    makePost: makePost,
    likePost: likePost,
    makeComment: makeComment,
    likeComment: likeComment
  };
});