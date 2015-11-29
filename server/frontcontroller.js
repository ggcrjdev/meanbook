var PostService = require('./service/postservice').PostService;
var CommentService = require('./service/commentservice').CommentService;

var frontController = function(io) {
  this.posts = {};
  this.postService = new PostService();
  this.commentService = new CommentService();

  this.io = io;
  this.loggedUsers = {};
  this.init();
};
frontController.prototype = {
  init: function() {
    var that = this;
    this.io.on('connection', function(socket) {
      console.log('Event connection: connected.');
      socket.on('disconnect', function() {
        console.log('Event disconnect: disconnected.');
        that.onDisconnect(socket);
      });
 
      that.bindEvents(socket);
      that.onUserList(socket);
    });
  },
  onDisconnect: function(socket) {
    delete this.loggedUsers[socket.id];
    this.onUserList(socket);
  },
  bindEvents: function(socket) {
    var that = this;
    socket.on('userlogin', function(data) {
      that.onUserLogin(socket, data);
    });
 
    socket.on('userlist', function(data) {
      that.onUserList(socket, data);
    });
 
    socket.on('makepost', function(data) {
      that.onMakePost(socket, data);
    });
 
    socket.on('makecomment', function(data) {
      that.onMakeComment(socket, data);
    });
 
    socket.on('likepost', function(data) {
      that.onLikePost(socket, data);
    });
 
    socket.on('likecomment', function(data) {
      that.onLikeComment(socket, data);
    });
  },
  onUserLogin: function(socket, data) {
    var that = this;
    if (data.username) {
      socket.handshake.username = data.username;
      that.loggedUsers[socket.id] = socket;
      socket.emit('userlogin');
      that.onUserList(socket);
      console.log('O usuário ' + socket.handshake.username + ' logou na app.');

      that.loadPosts(socket);
    } else {
      var msg = 'Defina um usuário para usar a app.';
      this.sendMessage(socket, msg);
      console.log(msg);
    }
  },
  onUserList: function(socket, data) {
    var that = this;
    var keys = Object.keys(this.loggedUsers);
    var userList = new Array(keys.length);
    var i = 0;
 
    keys.forEach(function(k) {
      userList[i++] = {
        id: k,
        username: that.loggedUsers[k].handshake.username
      };
    });
 
    socket.emit('userlist', userList);
    socket.broadcast.emit('userlist', userList);
  },
 
  sendMessage: function(socket, msg) {
    socket.emit('msg', {
      type: 'info',
      text: msg
    });
  },

  updatePostsInMemory: function(post) {
  },
  loadPosts: function(socket) {
    console.log('Carregando posts do usuário ' + socket.handshake.username);
    var that = this;
    that.postService.listByAuthor(socket.handshake.username, function(err, posts) {
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
        socket.emit('loadposts', responseData);
        socket.broadcast.emit('loadposts', responseData);
      }
    });
  },
  onMakePost: function(socket, data) {
    var that = this;
    var post = that.postService.create(socket.handshake.username, data);
    that.updatePostsInMemory(post);

    var responseData = {
      id: post._id,
      authorId: post.by,
      author: post.by,
      timestamp: post.creationDate,
      text: post.content
    };
    console.log('Criado post com id ' + post._id);
    socket.emit('makepost', responseData);
    socket.broadcast.emit('makepost', responseData);
  },
  onLikePost: function(socket, data) {
    var that = this;
    that.postService.doLike(data.postId, function(err, post) {
      that.updatePostsInMemory(post);

      var responseData = {
        postId: post._id, 
        numLikes: post.likes
      };
      console.log('Efetuado like para o post com id ' + post._id);
      socket.emit('likepost', responseData);
      socket.broadcast.emit('likepost', responseData);
    });
  },
 
  onMakeComment: function(socket, data) {
    var that = this;
    var comment = that.commentService.create(socket.handshake.username, data.text);
    that.postService.addComment(data.postId, comment, function(err, post) {
      that.updatePostsInMemory(post);
      
      var responseData = {
        postId: post._id,
        id: comment._id,
        authorId: comment.by,
        author: comment.by,
        timestamp: comment.creationDate,
        text: comment.content
      };
      console.log('Criado comentário com id ' + comment._id);
      socket.emit('makecomment', responseData);
      socket.broadcast.emit('makecomment', responseData);
    });
  },
  onLikeComment: function(socket, data) {
    var that = this;
    if (data.commentId) {
      that.commentService.doLike(data.commentId, function(err, comment) {
        that.postService.findById(data.postId, function(err, post) {
          that.updatePostsInMemory(post);
        });

        var responseData = {
          commentId: comment._id, 
          numLikes: comment.likes
        };
        console.log('Efetuado like para o comentário com id ' + comment._id);
        socket.emit('likecomment', responseData);
        socket.broadcast.emit('likecomment', responseData);
      });
    }
  }
};

module.exports = {
  FrontController: frontController 
};
