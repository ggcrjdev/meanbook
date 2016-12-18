'use strict';
var config  = require('./config');
var UsersRouter = require('../route/users').UsersRouter;
var PostsRouter = require('../route/posts').PostsRouter;
var CommentsRouter = require('../route/comments').CommentsRouter;

var api = function(app, express) {
  var baseUrl = config.express.apiBaseUri;
  var routers = createRouters(express);
  for (var i = 0; i < routers.length; i++) {
    var expressRouter = routers[i].router;
    app.use(baseUrl, expressRouter);
  }
};

var createRouters = function(express) {
  var routers = [];
  var usersRouter = new UsersRouter(express);
  routers.push(usersRouter);
  routers.push(new PostsRouter(express, usersRouter));
  routers.push(new CommentsRouter(express, usersRouter));
  return routers;
};

module.exports = {
  api: api
};
