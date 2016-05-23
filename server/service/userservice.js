var mongoose = require('mongoose');
var ServiceUtils = require('./serviceutils').ServiceUtils;
var User = require('../domain/model/user').User;

var userService = function() {
};
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
  findById: function(userId, callback) {
    User.findOne({_id: userId}, callback);
  },
  findByLogin: function(username, callback) {
    User.findOne({login: username}, callback);
  },
  listActiveUsers: function(callback) {
    User.find({active: true}, null, {sort: {login: 1}}, callback);
  }
};

module.exports = {
  UserService: userService 
};
