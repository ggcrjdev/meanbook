var mongodbUrl = 'mongodb://localhost:27017/meanbook';
if (process.env.NODE_ENV === 'production') {
  var mongodbCredentials = process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD;
  mongodbUrl = 'mongodb://' + mongodbCredentials + '@ds061385.mongolab.com:61385/heroku_8b3ctgjk';
}

var config = {
  express: {
    port: 3000,
    origins: '*',
    timestampFormat: 'HH:MM:ss.l',
    webBaseDir: '/../web',
    apiBaseUri: '/api/1.0'
  },
  mongodb: {
    url: mongodbUrl,
    socketOptions: {
      keepAlive: 10,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 20000
    }
  }
}

module.exports = config;
