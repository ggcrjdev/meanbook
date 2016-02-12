module.exports = {
    express: {
    	port: 3000,
    	origins: '*',
    	timestampFormat: 'HH:MM:ss.l',
        webBaseDir: '/../web',
        apiBaseUri: '/api/1.0'
    },
    mongodb: {
    	url: 'mongodb://localhost:27017/meanbook',
        socketTimeout: 10000
    }
}
