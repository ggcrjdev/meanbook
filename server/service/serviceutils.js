var serviceUtils = {};
serviceUtils.mongooseCallback = function(err, result) {
  if (err) {
    console.log('Error executing mongoose operation: ' + err);
  } else if (result) {
    console.log('Query result is: ' + result);
  }
};

module.exports = {
  ServiceUtils: serviceUtils 
};
