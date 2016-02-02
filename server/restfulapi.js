var PostService = require('./service/postservice').PostService;
var CommentService = require('./service/commentservice').CommentService;

var restfulApi = function(app) {
  this.posts = {};
  this.postService = new PostService();
  this.commentService = new CommentService();

  this.app = app;
  this.loggedUsers = {};
  this.init();
};
restfulApi.prototype = {
  init: function() {
    var that = this;
    console.log('Event connection: connected.');
    that.bindResources('/api/1.0');
  },
  bindResources: function(resourcePath) {
    this.bindUsersResource(resourcePath + '/users');
    this.bindPostsResource(resourcePath + '/posts');
    this.bindCommentsResource(resourcePath + '/comments');
  },
  bindUsersResource: function(resourceBasePath) {
    var that = this;
    that.app.get(resourceBasePath + '/list', function(req, res) {
      that.onUserList(req, res);
    });
    that.app.post(resourceBasePath + '/login', function(req, res) {
      that.onUserLogin(req, res);
    });
    that.app.post(resourceBasePath + '/logout', function(req, res) {
      that.onDisconnect(req, res);
    });
  },
  bindPostsResource: function(resourceBasePath) {
    var that = this;
    that.app.get(resourceBasePath + '/list', function(req, res) {
      that.loadPosts(req, res);
    });
    that.app.post(resourceBasePath + '/add', function(req, res) {
      that.onMakePost(req, res);
    });
    that.app.post(resourceBasePath + '/like', function(req, res) {
      that.onLikePost(req, res);
    });
  },
  bindCommentsResource: function(resourceBasePath) {
    var that = this;
    that.app.post(resourceBasePath + '/add', function(req, res) {
      that.onMakeComment(req, res);
    });
    that.app.post(resourceBasePath + '/like', function(req, res) {
      that.onLikeComment(req, res);
    });
  },

  loggedUsername: function(req, res) {
    var currentUsername = (req.session.user) ? req.session.user.username : null;
    console.log('loggedUsername = ' + currentUsername);
    return currentUsername;
  },
  onUserList: function(req, res) {
    var that = this;
    var keys = Object.keys(this.loggedUsers);
    var responseData = new Array(keys.length);
    var i = 0;
    keys.forEach(function(key) {
      responseData[i++] = {
        id: key,
        username: that.loggedUsers[key].username
      };
    });
    res.json(responseData);
  },
  onUserLogin: function(req, res) {
    var that = this;
    var data = req.body;
    if (data.username) {
      var user = {
        id: data.username,
        username: data.username,
        loginDate: new Date()
      };
      req.session.user = user;
      this.loggedUsers[user.username] = user;
      console.log('O usuário ' + user.username + ' logou na app e foi incluído na sessão.');
      res.json(user);
    } else {
      var msg = 'Defina um usuário para usar a app.';
      console.log(msg);
      that.sendMessage(req, res, msg);
    }
  },
  onDisconnect: function(req, res) {
    if (this.loggedUsername(req, res)) {
      delete this.loggedUsers[this.loggedUsername(req, res)];
      req.session.destroy(function(err) {});
      res.json({
        logggedOut: true
      });
    } else {
      res.json({
        logggedOut: false
      });
    }
  },

  sendMessage: function(req, res, msg) {
    var responseData = {
      type: 'info',
      text: msg
    };
    res.json(responseData);
  },

  loadPosts: function(req, res) {
    var that = this;
    console.log('Carregando posts do usuário ' + that.loggedUsername(req, res));
    that.postService.listByAuthor(this.loggedUsername(req, res), function(err, posts) {
      if (err) {
        console.log('Carregando posts: Erro: ' + err);
      } else {
        var loadedPosts = [];
        for (var i = 0; i < posts.length; i++) {
          var post = posts[i];
          var loadedPost = {
            id: post._id,
            authorId: post.by,
            author: post.by,
            timestamp: post.creationDate,
            text: post.content
          };
          loadedPosts.push(loadedPost);
        }

        var responseData = {
          posts: loadedPosts
        };
        console.log('Carregados ' + ((loadedPosts) ? loadedPosts.length : 0) + ' posts.');
        res.json(responseData);
      }
    });
  },
  onMakePost: function(req, res) {
    var that = this;
    var data = req.body;
    var post = that.postService.create(that.loggedUsername(req, res), data.text);
    var responseData = {
      id: post._id,
      authorId: post.by,
      author: post.by,
      timestamp: post.creationDate,
      text: post.content
    };
    console.log('Criado post com id ' + post._id);
    res.json(responseData);
  },
  onLikePost: function(req, res) {
    var that = this;
    var data = req.body;
    that.postService.doLike(data.postId, function(err, post) {
      var responseData = {
        postId: post._id,
        numLikes: post.likes
      };
      console.log('Efetuado like para o post com id ' + post._id);
      res.json(responseData);
    });
  },

  onMakeComment: function(req, res) {
    var that = this;
    var data = req.body;
    var comment = that.commentService.create(that.loggedUsername(req, res), data.text);
    that.postService.addComment(data.postId, comment, function(err, post) {
      var responseData = {
        postId: post._id,
        id: comment._id,
        authorId: comment.by,
        author: comment.by,
        timestamp: comment.creationDate,
        text: comment.content
      };
      console.log('Criado comentário com id ' + comment._id);
      res.json(responseData);
    });
  },
  onLikeComment: function(req, res) {
    var that = this;
    var data = req.body;
    if (data.commentId) {
      that.commentService.doLike(data.commentId, function(err, comment) {
        that.postService.findById(data.postId, function(err, post) {});

        var responseData = {
          commentId: comment._id,
          numLikes: comment.likes
        };
        console.log('Efetuado like para o comentário com id ' + comment._id);
        res.json(responseData);
      });
    }
  }
};

module.exports = {
  RestfulApi: restfulApi
};