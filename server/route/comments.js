var PostService = require('../service/postservice').PostService;
var CommentService = require('../service/commentservice').CommentService;
var RouterUtils = require('./routerutils').RouterUtils;
var commentsRouter = function(express, apiBaseUri, usersRounter) {
  this.init(express, apiBaseUri, usersRounter);
};

commentsRouter.prototype = {
  init: function(express, apiBaseUri, usersRounter) {
    this.postService = new PostService();
    this.commentService = new CommentService();

    this.apiBaseUri = apiBaseUri;
    this.usersRounter = usersRounter;
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
    var currentUserName = that.usersRounter.getCurrentUserName(req, res);
    var comment = that.commentService.create(currentUserName, data.text);
    that.postService.addComment(data.postId, comment, function(err, result) {
      if (err) {
        RouterUtils.sendErrorResponse(err, res, 101);
      } else {
        var responseData = {
          postId: result._id,
          id: comment._id,
          authorId: comment.by,
          author: comment.by,
          timestamp: comment.creationDate,
          text: comment.content
        };
        console.log('Criado comentário com id ' + comment._id);
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
          RouterUtils.sendErrorResponse(err, res, 102);
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
          RouterUtils.sendErrorResponse(errPost, res, 103);
        } else {
          var responseData = {
            commentId: comment._id,
            likes: comment.likes
          };
          console.log('Efetuado like para o post com id ' + postId + ' e comentário com id ' + comment._id + ' likes=' + comment.likes);
          res.json(responseData);
        }
      });
    }
  }
};

module.exports = {
  CommentsRouter: commentsRouter
};