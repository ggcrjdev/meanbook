var ServiceUtils = require('./serviceutils').ServiceUtils;
var Post = require('../domain/model/post').Post;

var postService = function() {
};
postService.prototype = {
  init: function() {
  },
  create: function(username, postText) {
    var post = new Post();
    post.content = postText;
    post.by = username;
    post.comments = [];
    post.save(ServiceUtils.mongooseCallback);
    return post;
  },
  doLike: function(postId, callback) {
    this.findById(postId, function(err, post) {
      if (post) {
        post.likes += 1;
        post.save(function(err) {
          callback(err, post);
        });
      } else {
        console.log('Not found the post with id ' + postId);
      }
    });
  },
  likeComment: function(postId, commentToLike, callback) {
    this.findById(postId, function(err, post) {
      if (post.comments) {
        for (var i = 0; i < post.comments.length; i++) {
          if (commentToLike._id.equals(post.comments[i]._id)) {
            post.comments[i].likes = commentToLike.likes;
            break;
          }
        }
      }
      post.save(ServiceUtils.mongooseCallback);
      callback(err, post);
    });
  },
  addComment: function(postId, comment, callback) {
    this.findById(postId, function(err, post) {
      if (post) {
        if (!post.comments) {
          post.comments = [];
        }
        post.comments.push(comment);
        post.save(ServiceUtils.mongooseCallback);
        callback(err, post);
      }
    });
  },
  findById: function(postId, callback) {
    Post.findOne({_id: postId}, callback);
  },
  listByAuthor: function(username, callback) {
    Post.find({by: username}, null, {sort: {creationDate: -1}}, callback);
  },
  listAll: function(callback) {
    Post.find({}, callback);
  }
};

module.exports = {
  PostService: postService 
};
