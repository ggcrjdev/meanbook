var serviceUtils = {};
serviceUtils.prototype = {
	mongooseCallback: function(err, result) {
	  if (err) {
	    console.log('mongooseCallback: Error executing mongoose operation: ' + err);
	  } else if (result) {
	    console.log('mongooseCallback: Query result is: ' + result);
	  }
	}
};

module.exports = {
  ServiceUtils: serviceUtils 
};
