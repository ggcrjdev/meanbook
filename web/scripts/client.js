define(['socketio'], function(io) {
      var events = {};

      console.log("socket-io-client: Connectiong to server...");
      var socket = io.connect("http://localhost:3000");
      console.log("socket-io-client: Connected to server.");

      //listeners
      socket.on('connect', function(data) {
          events.connect(data);
      });
   
      socket.on('msg', function(data) {
          console.log(data);
      });
   
      socket.on('userlogin', function(data) {
          events.userlogin(data);
      });
   
      socket.on('userlist', function(data) {
          events.userlist(data);
      });
   
      socket.on('loadposts', function(data) {
          events.loadposts(data);
      });
   
      socket.on('makepost', function(data) {
          events.makepost(data);
      });
   
      socket.on('makecomment', function(data) {
          events.makecomment(data);
      });
   
      socket.on('likepost', function(data) {
          events.likepost(data);
      });
   
      socket.on('likecomment', function(data) {
          events.likecomment(data);
      });

   
      //emits
      function userLogin(username) {
          socket.emit('userlogin', {username: username});
      }
   
      function makePost(post) {
          socket.emit('makepost', post);
      }
   
      function likePost(likeData) {
          socket.emit('likepost', likeData);
      }
   
      function makeComment(comment) {
          socket.emit('makecomment', comment);
      }
   
      function likeComment(likeData) {
          socket.emit('likecomment', likeData);
      }
   
      return {
          socket: socket,
          userLogin: userLogin,
          makePost: makePost,
          makeComment: makeComment,
          events: events,
          likePost: likePost,
          likeComment: likeComment
      };
  });
