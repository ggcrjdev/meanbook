"use strict";
var serviceUtils = {

  PAGE_SIZE: 20,

  mongooseCallback: function(err, result) {
    if (err) {
      console.log('mongooseCallback: Error executing mongoose operation: ' + err);
    } else if (result) {
      console.log('mongooseCallback: Query result is: ' + result);
    }
  },

  mongooseIncludePageSizeOptions: function(options, pageNumber) {
    if (typeof pageNumber === 'number') {
      options.skip = this.PAGE_SIZE * (pageNumber - 1);
      options.limit = this.PAGE_SIZE;
    }
    return options;
  }
};

module.exports = {
  ServiceUtils: serviceUtils
};