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
    that.app.post(resourceBasePath + '/login', function (req, res) {
      that.onUserLogin(req, res);
    });
    that.app.post(resourceBasePath + '/logout', function (req, res) {
      that.onDisconnect(req, res);
    });
  },
  bindPostsResource: function(resourceBasePath) {
    var that = this;
    that.app.get(resourceBasePath + '/list', function (req, res) {
      that.loadPosts(req, res);
    });
    that.app.post(resourceBasePath + '/add', function (req, res) {
      that.onMakePost(req, res);
    });
    that.app.post(resourceBasePath + '/like', function (req, res) {
      that.onLikePost(req, res);
    });
  },
  bindCommentsResource: function(resourceBasePath) {
    var that = this;
    that.app.post(resourceBasePath + '/add', function (req, res) {
      that.onMakeComment(req, res);
    });
    that.app.post(resourceBasePath + '/like', function (req, res) {
      that.onLikeComment(req, res);
    });
  },  

  loggedUsername: function(req, res) {
    return 'ggc';
  },
  onDisconnect: function(req, res) {
    delete this.loggedUsers[this.loggedUsername(req, res)];
    this.onUserList(req, res);
  },
  onUserLogin: function(req, res) {
    var that = this;
    var data = req.params;
    if (data.username) {
      that.loggedUsers[data.username] = {
        username: data.username,
        loginDate: new Date()
      };
      console.log('O usuário ' + data.username + ' logou na app.');
      that.onUserList(req, res);
    } else {
      var msg = 'Defina um usuário para usar a app.';
      console.log(msg);
      that.sendMessage(req, res, msg);
    }
  },
  onUserList: function(req, res) {
    var that = this;
    var data = req.params;
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
    var data = req.params;
    var post = that.postService.create(that.loggedUsername(req, res), data);
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
    var data = req.params;
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
    var data = req.params;
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
    var data = req.params;
    if (data.commentId) {
      that.commentService.doLike(data.commentId, function(err, comment) {
        that.postService.findById(data.postId, function(err, post) {
        });

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
