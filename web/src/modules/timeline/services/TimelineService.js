"use strict";
define([], function() {
  return function(messageService, 
      userService, 
      meanBookApi) {
    var entity = {
      posts: [],
      username: null,
      isCurrentUser: function() {
        return userService.entity.username === this.username;
      },
      clear: function() {
        this.posts = [];
        this.username = null;
      }
    };

    function switchTimeline(username) {
      loadPosts(username);
    }
    function makePost(content, callback) {
      meanBookApi.makePost(content).then(function(response) {
        loadPosts();
        callback(response.data);
      }, messageService.errorHandling);
    }
    function likePost(postId, callback) {
      meanBookApi.likePost(postId).then(function(response) {
        loadPosts();
        callback(response.data);
      }, messageService.errorHandling);
    }
    function makeComment(postId, content, callback) {
      meanBookApi.makeComment(content, postId).then(function(response) {
        loadPosts();
        callback(response.data);
      }, messageService.errorHandling);
    }
    function likeComment(commentId, postId, callback) {
      meanBookApi.likeComment(commentId, postId).then(function(response) {
        loadPosts();
        callback(response.data);
      }, messageService.errorHandling);
    }
    function loadPosts(username) {
      if (!username)
        username = entity.username;

      meanBookApi.listPosts(username).then(function(response) {
        entity.username = username;
        entity.posts = response.data.posts;
      }, messageService.errorHandling);
    }

    return {
      entity: entity,
      switchTimeline: switchTimeline,
      makePost: makePost,
      likePost: likePost,
      makeComment: makeComment,
      likeComment: likeComment,
      loadPosts: loadPosts
    };
  };
});
