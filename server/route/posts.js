"use strict";
var PostService = require('../service/postservice').PostService;
var RouterUtils = require('./routerutils').RouterUtils;
var postsRouter = function(express, apiBaseUri, usersRouter) {
  this.init(express, apiBaseUri, usersRouter);
};

postsRouter.prototype = {
  init: function(express, apiBaseUri, usersRouter) {
    this.postService = new PostService();

    this.apiBaseUri = apiBaseUri;
    this.usersRouter = usersRouter;
    this.routerBaseUri = '/posts';
    this.router = express.Router();
    this.initRouterMiddleware();
    this.initRoutes();
  },
  initRouterMiddleware: function() {
    // middleware that is specific to this router
    var that = this;
    that.router.use(function(req, res, next) {
      console.log('Processing request to ' + that.routerBaseUri + ' router.');
      next();
    });
  },
  initRoutes: function() {
    var that = this;
    that.router.get('/list/:username', function(req, res) {
      that.list(req, res);
    });
    that.router.post('/add', function(req, res) {
      that.add(req, res);
    });
    that.router.post('/like', function(req, res) {
      that.like(req, res);
    });
  },
  useRouter: function(app) {
    app.use(this.apiBaseUri + this.routerBaseUri, this.router);
  },


  list: function(req, res) {
    var that = this;
    var currentUserName = req.params.username;
    if (!currentUserName) {
      currentUserName = that.usersRouter.getCurrentUserName(req, res);
    }
    console.log('Loading posts of the user ' + currentUserName);
    
    that.postService.listByAuthor(currentUserName, function(err, results) {
      if (err) {
        RouterUtils.sendErrorResponse('MONGODB_QUERY_EXEC_ERROR', res, err);
      } else {
        var loadedPosts = [];
        for (var i = 0; i < results.length; i++) {
          var post = results[i];
          var loadedPostComments = that.listPostComments(post);
          var loadedPost = {
            id: post._id,
            author: post.by,
            timestamp: post.creationDate,
            text: post.content,
            likes: post.likes,
            comments: loadedPostComments,
            commentsCount: loadedPostComments.length,
            hasComments: (loadedPostComments.length > 0)
          };
          loadedPosts.push(loadedPost);
        }

        var responseData = {
          posts: loadedPosts,
          postsCount: loadedPosts.length
        };
        console.log('Loaded ' + ((loadedPosts) ? loadedPosts.length : 0) + ' posts.');
        res.json(responseData);
      }
    });
  },
  listPostComments: function(post) {
    var loadedComments = [];
    if (post.comments) {
      for (var i = 0; i < post.comments.length; i++) {
        var comment = post.comments[i];
        var loadedComment = {
          id: comment._id,
          author: comment.by,
          timestamp: comment.creationDate,
          text: comment.content,
          likes: comment.likes
        };
        loadedComments.push(loadedComment);
      }
    }
    return loadedComments;
  },
  add: function(req, res) {
    var that = this;
    var data = req.body;
    var currentUserName = that.usersRouter.getCurrentUserName(req, res);
    var post = that.postService.create(currentUserName, data.text);
    var responseData = {
      id: post._id,
      authorId: post.by,
      author: post.by,
      timestamp: post.creationDate,
      text: post.content
    };
    console.log('Created post with id ' + post._id);
    res.json(responseData);
  },
  like: function(req, res) {
    var that = this;
    var data = req.body;
    that.postService.doLike(data.postId, function(err, result) {
      if (err) {
        RouterUtils.sendErrorResponse('MONGODB_QUERY_EXEC_ERROR', res, err);
      } else {
        var responseData = {
          postId: result._id,
          numLikes: result.likes
        };
        console.log('Make like to the post with id ' + result._id);
        res.json(responseData);
      }
    });
  }
};

module.exports = {
  PostsRouter: postsRouter
};