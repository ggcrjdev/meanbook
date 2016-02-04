var usersRouter = function(express, apiBaseUri) {
  this.init(express, apiBaseUri);
};

usersRouter.prototype = {
  init: function(express, apiBaseUri) {
    this.loggedUsers = new Array();

    this.apiBaseUri = apiBaseUri;
    this.routerBaseUri = '/users';
    this.router = express.Router();
    this.initRouterMiddleware();
    this.initRoutes();
  },
  initRouterMiddleware: function() {
    // middleware that is specific to this router
    var that = this;
    that.router.use(function(req, res, next) {
      console.log('Processing request to ' + that.routerBaseUri + ' router.');
      next();
    });
  },
  initRoutes: function() {
    var that = this;
    that.router.get('/list', function(req, res) {
      that.list(req, res);
    });
    that.router.post('/login', function(req, res) {
      that.login(req, res);
    });
    that.router.post('/logout', function(req, res) {
      that.logout(req, res);
    });
  },
  useRouter: function(app) {
    app.use(this.apiBaseUri + this.routerBaseUri, this.router);
  },

  getCurrentUserName: function(req, res) {
    var currentUsername = (req.session.user) ? req.session.user.username : null;
    console.log('getCurrentUserName = ' + currentUsername);
    return currentUsername;
  },
  isLoggedIn: function(req, res) {
    return this.getCurrentUserName(req, res) != null;
  },

  list: function(req, res) {
    var responseData = {
      users: this.loggedUsers
    };
    res.json(responseData);
  },
  login: function(req, res) {
    var that = this;
    var data = req.body;
    if (data.username) {
      var user = {
        id: data.username,
        username: data.username,
        loginDate: new Date()
      };
      req.session.user = user;
      this.loggedUsers.push(user);
      console.log('O usuário ' + user.username + ' logou na app e foi incluído na sessão.');
      res.json(user);
    } else {
      var msg = 'Defina um usuário para usar a app.';
      console.log(msg);
      that.sendMessage(req, res, msg);
    }
  },
  logout: function(req, res) {
    var loggedOut = false;
    if (this.isLoggedIn(req, res)) {
      var currentUserName = this.getCurrentUserName(req, res);
      var indexToDelete = -1;
      for (var i = 0; i < this.loggedUsers.length; i++) {
        var user = this.loggedUsers[i];
        if (user && user.id == currentUserName) {
          indexToDelete = i;
          break;
        }
      }
      if (indexToDelete != -1) {
        this.loggedUsers.splice(indexToDelete, 1);
      }
      req.session.destroy(function(err) {});
      loggedOut = true;
    }
    res.json({
      logggedOut: loggedOut
    });
  },
  sendMessage: function(req, res, msg) {
    var responseData = {
      type: 'info',
      text: msg
    };
    res.json(responseData);
  }
};

module.exports = {
  UsersRouter: usersRouter
};