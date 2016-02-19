var UsersRouter = require('../route/users').UsersRouter;
var PostsRouter = require('../route/posts').PostsRouter;
var CommentsRouter = require('../route/comments').CommentsRouter;
var restfulApi = function(express, apiBaseUri) {
  this.init(express, apiBaseUri);
};

restfulApi.prototype = {
  init: function(express, apiBaseUri) {
    this.usersRouter = new UsersRouter(express, apiBaseUri);
    this.postsRouter = new PostsRouter(express, apiBaseUri, this.usersRouter);
    this.commentsRouter = new CommentsRouter(express, apiBaseUri, this.usersRouter);
  },
  useRouters: function(app) {
    this.usersRouter.useRouter(app);
    this.postsRouter.useRouter(app);
    this.commentsRouter.useRouter(app);
  }
};

module.exports = {
  RestfulApi: restfulApi
};