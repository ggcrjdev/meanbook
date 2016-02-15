var mongoose = require('mongoose');
var ServiceUtils = require('./serviceutils').ServiceUtils;
var Comment = require('../domain/model/comment').Comment;

var commentService = function() {
};
commentService.prototype = {
  init: function() {
  },
  create: function(postId, username, commentText) {
    var comment = new Comment();
    if (typeof postId == 'string') {
      comment.postId = new mongoose.Types.ObjectId(postId);
    } else {
      comment.postId = postId;
    }
    comment.content = commentText;
    comment.by = username;
    comment.save(ServiceUtils.mongooseCallback);
    return comment;
  },
  doLike: function(commentId, callback) {
    this.findById(commentId, function(err, comment) {
      if (comment) {
        comment.likes += 1;
        comment.save(function(err) {
          callback(err, comment);
        });
      } else {
        console.log('Not found the comment with id ' + commentId);
      }
    });
  },
  findById: function(commentId, callback) {
    Comment.findOne({_id: commentId}, callback);
  }
};

module.exports = {
  CommentService: commentService 
};
