var mongodbUrl = 'mongodb://localhost:27017/meanbook';
if (process.env.NODE_ENV === 'production') {
  mongodbUrl = 'mongodb://heroku_8b3ctgjk:heroku_8b3ctgjk@ds061385.mongolab.com:61385/heroku_8b3ctgjk';
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
    socketTimeout: 10000
  }
}

module.exports = config;
