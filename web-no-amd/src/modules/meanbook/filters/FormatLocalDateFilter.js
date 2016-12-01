'use strict';
angular.module('meanBookModule')
  .filter('formatTimestamp', function(dateUtils) {
    return dateUtils.formatTimestamp;
  });
