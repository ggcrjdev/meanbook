"use strict";
var mongoose = require('mongoose');
var ServiceUtils = require('./serviceutils').ServiceUtils;
var User = require('../domain/model/user').User;

var userService = function() {};
userService.prototype = {
  init: function() {
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
    var findConditions = {
      active: true, 
      public: true
    };
    var sortBy = {
      lastAccess: -1,
      login: 1
    };
    User.find(findConditions, null, {sort: sortBy}, callback);
  }
};

module.exports = {
  UserService: userService 
};
