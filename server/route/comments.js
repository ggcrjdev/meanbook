"use strict";
var PostService = require('../service/postservice').PostService;
var CommentService = require('../service/commentservice').CommentService;
var RouterUtils = require('./routerutils').RouterUtils;
var commentsRouter = function(express, apiBaseUri, usersRouter) {
  this.init(express, apiBaseUri, usersRouter);
};

commentsRouter.prototype = {
  init: function(express, apiBaseUri, usersRouter) {
    this.postService = new PostService();
    this.commentService = new CommentService();

    this.apiBaseUri = apiBaseUri;
    this.usersRouter = usersRouter;
    this.routerBaseUri = '/comments';
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

  add: function(req, res) {
    var that = this;
    var data = req.body;
    var currentUserName = that.usersRouter.getCurrentUserName(req, res);
    var comment = that.commentService.create(data.postId, currentUserName, data.text);
    that.postService.addComment(data.postId, comment, function(err, result) {
      if (err) {
        RouterUtils.sendErrorResponse('MONGODB_QUERY_EXEC_ERROR', res, err);
      } else {
        var responseData = {
          postId: result._id,
          id: comment._id,
          authorId: comment.by,
          author: comment.by,
          timestamp: comment.creationDate,
          text: comment.content
        };
        console.log('Created comment with id ' + comment._id);
        res.json(responseData);
      }
    });
  },
  like: function(req, res) {
    var that = this;
    var data = req.body;
    if (data.commentId) {
      that.commentService.doLike(data.commentId, function(err, resultComment) {
        if (err) {
          RouterUtils.sendErrorResponse('MONGODB_QUERY_EXEC_ERROR', res, err);
        } else {
          that.likeCommentInPost(res, data.postId, resultComment);
        }
      });
    }
  },
  likeCommentInPost: function(res, postId, comment) {
    var that = this;
    if (postId) {
      that.postService.likeComment(postId, comment, function(errPost, resultPost) {
        if (errPost) {
          RouterUtils.sendErrorResponse('MONGODB_QUERY_EXEC_ERROR', res, err);
        } else {
          var responseData = {
            commentId: comment._id,
            likes: comment.likes
          };
          console.log('Make like to the comment in post with id ' + postId + ' e comentário com id ' + comment._id + ' likes=' + comment.likes);
          res.json(responseData);
        }
      });
    }
  }
};

module.exports = {
  CommentsRouter: commentsRouter
};