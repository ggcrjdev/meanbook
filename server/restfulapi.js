var usersRouter = require('./route/users');
var postsRouter = require('./route/posts');
var commentsRouter = require('./route/comments');
var restfulApi = function(express, apiBaseUri) {
  this.init(express, apiBaseUri);
};

restfulApi.prototype = {
  init: function(express, apiBaseUri) {
    this.usersRouter = usersRouter(express, apiBaseUri);
    this.postsRouter = postsRouter(express, apiBaseUri, usersRouter);
    this.commentsRouter = commentsRouter(express, apiBaseUri, usersRouter);
  },
  useRouters: function(app) {
    this.usersRouter.useRouter(app);
    this.postsRouter.useRouter(app);
    this.commentsRouter.useRouter(app);
  }
};

module.exports = restfulApi;