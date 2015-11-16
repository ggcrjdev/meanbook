module.exports = {
    express: {
    	port: 3000,
    	origins: "*"
    },
    socketio: {
    	origins: "*:*",
    	transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
    },
    mongodb: {
    	url: "mongodb://localhost:27017/meanbook"
    }
}
