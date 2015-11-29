var ServiceUtils = require('./serviceutils').ServiceUtils;
var Comment = require('../domain/model/comment').Comment;

var commentService = function() {
};
commentService.prototype = {
  init: function() {
  },
  create: function(username, commentText) {
    var comment = new Comment();
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
        console.log('Não foi encontrado o comentario com id ' + commentId);
      }
    });
  },
  findById: function(id, callback) {
    Comment.findOne({_id: id}, callback);
  }
};

module.exports = {
  CommentService: commentService 
};
