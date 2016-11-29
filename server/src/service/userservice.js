'use strict';
var mongoose = require('mongoose');
var ServiceUtils = require('./serviceutils').ServiceUtils;
var User = require('../domain/model/user').User;

var userService = function() {};
userService.prototype = {
  init: function() {
  },
  validateUsername: function(username) {
    return username !== null && username.length >= 3 && username.length <= 25 &&
      username.search('^([a-zA-Z0-9]{1})[a-zA-Z0-9-.]+([a-zA-Z0-9]{1})$') !== -1;
  },
  registerLoggedUser: function(username, callback) {
    var that = this;
    that.findByLogin(username, function(err, user) {
      if (err) {
        callback(err, user);
      } else if (user) {
        that.markActive(username, true, function(errMarkActive, activeUser) {
          callback(errMarkActive, activeUser);
        });
      } else {
        callback(null, that.create(username));
      }
    });
  },
  create: function(username) {
    var user = new User();
    user.login = username;
    user.save(ServiceUtils.mongooseCallback);
    return user;
  },
  markActive: function(username, active, callback) {
    this.findByLogin(username, function(err, user) {
      if (err) {
        callback(err, user);
      } else if (user) {
        user.active = active;
        if (active) {
          user.lastAccess = new Date();
        }
        user.save(ServiceUtils.mongooseCallback);
        callback(err, user);
      } else {
        console.log('Not found the user with username ' + username);
      }
    });
  },
  saveUser: function(userData, callback) {
    var that = this;
    that.findByLogin(userData.username, function(err, user) {
      if (err) {
        callback(err, user);
      } else if (user) {
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        user.email = userData.email;
        user.birthday = new Date(userData.birthday);
        user.public = userData.public;
        user.save(ServiceUtils.mongooseCallback);
        callback(err, user);
      }
    });
  },
  findById: function(userId, callback) {
    User.findOne({_id: userId}, callback);
  },
  findByLogin: function(username, callback) {
    User.findOne({login: username}, callback);
  },
  listActiveUsers: function(callback) {
    var conditions = {
      active: true, 
      public: true
    };
    var options = {
      sort: {
        lastAccess: -1,
        login: 1
      }
    };
    options = ServiceUtils.mongooseIncludePageSizeOptions(options, 1);
    User.find(conditions, null, options, callback);
  }
};

module.exports = {
  UserService: userService 
};
