"use strict";
var ServiceUtils = require('./serviceutils').ServiceUtils;
var Post = require('../domain/model/post').Post;

var postService = function() {};
postService.prototype = {
  init: function() {},
  create: function(username, postText, callback) {
    var post = new Post();
    post.content = postText;
    post.by = username;
    post.comments = [];
    post.save(function(err, result) {
      callback(err, result);
    });
  },
  doLike: function(postId, callback) {
    this.findById(postId, function(err, post) {
      if (post) {
        post.likes += 1;
        post.save(function(err, result) {
          callback(err, result);
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
      post.save(function(err, result) {
        callback(err, result);
      });
    });
  },
  addComment: function(postId, comment, callback) {
    this.findById(postId, function(err, post) {
      if (post) {
        if (!post.comments) {
          post.comments = [];
        }
        post.comments.splice(0, 0, comment);
        post.save(function(err, result) {
          callback(err, result);
        });
      }
    });
  },
  findById: function(postId, callback) {
    Post.findOne({
      _id: postId
    }, callback);
  },
  listByAuthor: function(username, pageNumber, callback) {
    var conditions = {
      by: username
    };
    var options = {
      sort: {
        creationDate: -1
      }
    };
    options = ServiceUtils.mongooseIncludePageSizeOptions(options, pageNumber);
    Post.find(conditions, null, options, callback);
  },
  listAll: function(callback) {
    Post.find({}, callback);
  }
};

module.exports = {
  PostService: postService
};
