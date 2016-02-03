var usersRouter = function(express, apiBaseUri) {
  this.init(express, apiBaseUri);
};

usersRouter.prototype = {
  init: function(express, apiBaseUri) {
    this.loggedUsers = {};

    this.apiBaseUri = apiBaseUri;
    this.routerBaseUri = '/users';
    this.router = express.Router();
    initRounterMiddleware();
    initRoutes();
  },
  initRounterMiddleware: function() {
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
    var that = this;
    var keys = Object.keys(this.loggedUsers);
    var responseData = new Array(keys.length);
    var i = 0;
    keys.forEach(function(key) {
      responseData[i++] = {
        id: key,
        username: that.loggedUsers[key].username
      };
    });
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
      this.loggedUsers[user.username] = user;
      console.log('O usuário ' + user.username + ' logou na app e foi incluído na sessão.');
      res.json(user);
    } else {
      var msg = 'Defina um usuário para usar a app.';
      console.log(msg);
      that.sendMessage(req, res, msg);
    }
  },
  logout: function(req, res) {
    if (this.isLoggedIn(req, res)) {
      delete this.loggedUsers[this.getCurrentUserName(req, res)];
      req.session.destroy(function(err) {});
      res.json({
        logggedOut: true
      });
    } else {
      res.json({
        logggedOut: false
      });
    }
  },
  sendMessage: function(req, res, msg) {
    var responseData = {
      type: 'info',
      text: msg
    };
    res.json(responseData);
  }
};

module.exports = usersRouter;