'use strict';
var PostService = require('../service/postservice').PostService;
var CommentService = require('../service/commentservice').CommentService;
var RouterUtils = require('./routerutils').RouterUtils;

var commentsRouter = function(express, usersRouter) {
  this.init(express, usersRouter);
};
commentsRouter.prototype = {
  init: function(express, usersRouter) {
    var that = this;
    this.postService = new PostService();
    this.commentService = new CommentService();
    this.usersRouter = usersRouter;
    
    var router = express.Router();
    router.post('/comments/add', function(req, res) {
      that.add(req, res);
    });
    router.post('/comments/like', function(req, res) {
      that.like(req, res);
    });
    this.router = router;
  },

  add: function(req, res) {
    var that = this;
    var data = req.body;
    var currentUserName = that.usersRouter.getCurrentUserName(req, res);
    that.commentService.create(data.postId, currentUserName, data.text, function(errCreateCommet, resultCreateCommet) {
      if (errCreateCommet) {
        RouterUtils.sendErrorResponse('MONGODB_QUERY_EXEC_ERROR', res, errCreateCommet);
      } else {
        var comment = resultCreateCommet;
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
      }
    });
  },
  like: function(req, res) {
    var that = this;
    var data = req.body;
    if (data.commentId) {
      that.commentService.doLike(data.commentId, function(err, result) {
        if (err) {
          RouterUtils.sendErrorResponse('MONGODB_QUERY_EXEC_ERROR', res, err);
        } else {
          that.likeCommentInPost(res, data.postId, result);
        }
      });
    }
  },
  likeCommentInPost: function(res, postId, comment) {
    var that = this;
    if (postId) {
      that.postService.likeComment(postId, comment, function(err, result) {
        if (err) {
          RouterUtils.sendErrorResponse('MONGODB_QUERY_EXEC_ERROR', res, err);
        } else {
          var responseData = {
            commentId: comment._id,
            likes: comment.likes
          };
          console.log('Make like to the comment in post with id ' + postId + ' e comentário com id ' +
            comment._id + ' likes=' + comment.likes);
          res.json(responseData);
        }
      });
    }
  }
};

module.exports = {
  CommentsRouter: commentsRouter
};
