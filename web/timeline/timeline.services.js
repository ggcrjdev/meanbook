"use strict";
define([], function() {
  function onlineUsersService($interval, defaultLoadUsersTimeout, messageService, meanBookApi) {
    var loadUsersTimer = null;
    var entity = {
      users: []
    };

    function load() {
      meanBookApi.listUsers().then(function(response) {
        entity.users = response.data.users;
      }, messageService.errorHandling);
    };
    function startPulling(loadUsersNow) {
      if (!loadUsersNow)
        loadUsersNow = true;
      if (loadUsersNow)
        load();
      loadUsersTimer = $interval(load, defaultLoadUsersTimeout);
    };
    function stopPulling() {
      if (loadUsersTimer) {
        $interval.cancel(loadUsersTimer);
      }
    };

    return {
      entity: entity,
      load: load,
      startPulling: startPulling,
      stopPulling: stopPulling
    };
  }

  function timelineService(messageService, userService, meanBookApi) {
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
    };
    function makePost(content, callback) {
      meanBookApi.makePost(content).then(function(response) {
        loadPosts();
        callback(response.data);
      }, messageService.errorHandling);
    };
    function likePost(postId, callback) {
      meanBookApi.likePost(postId).then(function(response) {
        loadPosts();
        callback(response.data);
      }, messageService.errorHandling);
    };
    function makeComment(postId, content, callback) {
      meanBookApi.makeComment(content, postId).then(function(response) {
        loadPosts();
        callback(response.data);
      }, messageService.errorHandling);
    };
    function likeComment(commentId, postId, callback) {
      meanBookApi.likeComment(commentId, postId).then(function(response) {
        loadPosts();
        callback(response.data);
      }, messageService.errorHandling);
    };
    function loadPosts(username) {
      if (!username)
        username = entity.username;

      meanBookApi.listPosts(username).then(function(response) {
        entity.username = username;
        entity.posts = response.data.posts;
      }, messageService.errorHandling);
    };

    return {
      entity: entity,
      switchTimeline: switchTimeline,
      makePost: makePost,
      likePost: likePost,
      makeComment: makeComment,
      likeComment: likeComment,
      loadPosts: loadPosts
    };
  }

  /*** Export ***/
  return {
    onlineUsersService: onlineUsersService, 
    timelineService: timelineService
  };
});
