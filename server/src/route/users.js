'use strict';
var UserService = require('../service/userservice').UserService;
var RouterUtils = require('./routerutils').RouterUtils;

var usersRouter = function(express, apiBaseUri) {
  this.init(express, apiBaseUri);
};
usersRouter.prototype = {
  init: function(express) {
    var that = this;
    this.userService = new UserService();

    var router = express.Router();
    router.get('/users/list', function(req, res) {
      that.list(req, res);
    });
    router.post('/users/current', function(req, res) {
      that.currentUser(req, res);
    });
    router.put('/users/edit', function(req, res) {
      that.saveUser(req, res);
    });
    router.post('/users/login', function(req, res) {
      that.login(req, res);
    });
    router.post('/users/logout', function(req, res) {
      that.logout(req, res);
    });
    this.router = router;
  },

  getCurrentUserName: function(req, res) {
    var currentUsername = (req.session.user) ? req.session.user.username : null;
    console.log('getCurrentUserName = ' + currentUsername);
    return currentUsername;
  },
  isLoggedIn: function(req, res) {
    return this.getCurrentUserName(req, res) !== null;
  },

  currentUser: function(req, res) {
    var username = this.getCurrentUserName(req, res);
    var responseData = {
      authenticated: (username !== null),
      username: username
    };
    res.json(responseData);
  },
  saveUser: function(req, res) {
    var that = this;
    var data = req.body;
    if (data.username) {
      this.userService.saveUser(data, function(err, user) {
        if (err) {
          RouterUtils.sendErrorResponse('MONGODB_QUERY_EXEC_ERROR', res, err);
        } else {
          res.json(that.createUserResponseData(user));
        }
      });
    } else {
      RouterUtils.sendErrorResponse('APP_USER_NOT_FOUND', res);
    }
  },
  list: function(req, res) {
    var that = this;
    this.userService.listActiveUsers(function(err, results) {
      if (err) {
        RouterUtils.sendErrorResponse('MONGODB_QUERY_EXEC_ERROR', res, err);
      } else {
        var loggedUsers = [];
        for (var i = 0; i < results.length; i++) {
          loggedUsers.push(that.createUserResponseData(results[i]));
        }

        var responseData = {
          users: loggedUsers
        };
        res.json(responseData);
      }
    });
  },
  login: function(req, res) {
    var that = this;
    var data = req.body;
    if (this.userService.validateUsername(data.username)) {
      this.userService.registerLoggedUser(data.username, function(err, user) {
        if (err) {
          RouterUtils.sendErrorResponse('MONGODB_QUERY_EXEC_ERROR', res, err);
        } else {
          var responseData = that.createUserResponseData(user);
          req.session.user = responseData;
          console.log('The user ' + responseData.username + ' logged in.');
          res.json(responseData);
        }
      });
    } else {
      RouterUtils.sendErrorResponse('APP_USERNAME_INVALID', res);
    }
  },
  logout: function(req, res) {
    var that = this;
    var loggedOut = false;
    if (this.isLoggedIn(req, res)) {
      var currentUserName = this.getCurrentUserName(req, res);
      this.userService.markActive(currentUserName, false, function(err, result) {
        if (err)
          console.log('The user ' + currentUserName + ' logged out, but cannot be passed to inactive state.');
      });

      // // The session must be cleaned instead of destroyed because
      // the csurf library includes data within them.
      req.session.user = null;
      loggedOut = true;
    }

    res.json({
      logggedOut: loggedOut
    });
  },
  createUserResponseData: function(userEntity) {
    return {
      id: userEntity.login,
      username: userEntity.login,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      email: userEntity.email,
      birthday: (userEntity.birthday) ? userEntity.birthday : null,
      birthdayDay: (userEntity.birthday) ? userEntity.birthday.getDate() : null,
      birthdayMonth: (userEntity.birthday) ? userEntity.birthday.getMonth() + 1 : null,
      birthdayYear: (userEntity.birthday) ? userEntity.birthday.getFullYear() : null,
      public: userEntity.public,
      loginDate: userEntity.lastAccess
    };
  }
};

module.exports = {
  UsersRouter: usersRouter
};
