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
  doLike: function(postId) {
    this.findById(postId, function(err, post) {
      if (post) {
        post.likes += 1;
        post.save(ServiceUtils.mongooseCallback);
      } else {
        console.log('Não foi encontrado o post com id ' + postId);
      }
    });
  },
  addComment: function(postId, comment) {
    this.findById(postId, function(err, currentPost) {
      currentPost.comments[currentPost.comments.length++] = comment;
      currentPost.save(ServiceUtils.mongooseCallback);
    });
  },
  findById: function(id, callback) {
    Post.findOne({_id: id}, callback);
  },
  listByAuthor: function(username, callback) {
    Post.find({by: username}, callback);
  },
  listAll: function(callback) {
    Post.find({}, callback);
  }
};

module.exports = {
  PostService: postService 
};
