'use strict';
define([], function() {
  return function(messageService, 
      userService, 
      meanBookApi) {
    var entity = {
      posts: [],
      pagination: {
        nextPage: 1,
        endOfPage: false,
        reset: function() {
          this.nextPage = 1;
          this.endOfPage = false;
        }
      },
      username: null,
      isCurrentUser: function() {
        return userService.entity.username === this.username;
      },
      clear: function() {
        this.posts = [];
        this.pagination.reset();
        this.username = null;
      }
    };

    function makePost(content, callback) {
      meanBookApi.makePost(content).then(function(response) {
        loadFirstPosts();
        callback(response.data);
      }, messageService.errorHandling);
    }
    function likePost(postId, callback) {
      meanBookApi.likePost(postId).then(function(response) {
        loadFirstPosts();
        callback(response.data);
      }, messageService.errorHandling);
    }
    function makeComment(postId, content, callback) {
      meanBookApi.makeComment(content, postId).then(function(response) {
        loadFirstPosts();
        callback(response.data);
      }, messageService.errorHandling);
    }
    function likeComment(commentId, postId, callback) {
      meanBookApi.likeComment(commentId, postId).then(function(response) {
        loadFirstPosts();
        callback(response.data);
      }, messageService.errorHandling);
    }

    function loadFirstPosts(username) {
      entity.pagination.reset();
      loadNextPageOfPosts(username);
    }
    function loadNextPageOfPosts(username) {
      var postsPagination = entity.pagination;
      loadPosts(username, postsPagination.nextPage, function(result) {
        if (result.posts.length < 10)
          postsPagination.endOfPage = true;
      });
      postsPagination.nextPage++;
    }
    function loadPosts(username, pageNumber, callback) {
      if (!username)
        username = entity.username;
      if (!pageNumber)
        pageNumber = 1;

      meanBookApi.listPosts(username, pageNumber).then(function(response) {
        entity.username = username;
        addPostsLoaded(response.data.posts, pageNumber);

        if (callback)
          callback(response.data);
      }, messageService.errorHandling);
    }
    function addPostsLoaded(posts, pageNumber) {
      if (firstPage(pageNumber)) {
        entity.posts = posts;
      } else {
        for (var i = 0; i < posts.length; i++) {
          entity.posts.push(posts[i]);
        }
      }
    }
    function firstPage(pageNumber) {
      return pageNumber === null || pageNumber === 1;
    }

    return {
      entity: entity,
      makePost: makePost,
      likePost: likePost,
      makeComment: makeComment,
      likeComment: likeComment,
      loadFirstPosts: loadFirstPosts,
      loadNextPageOfPosts: loadNextPageOfPosts
    };
  };
});
