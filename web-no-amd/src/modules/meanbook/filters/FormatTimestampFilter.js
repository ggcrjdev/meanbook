'use strict';
angular.module('meanBookModule')
  .filter('formatLocalDate', function(dateUtils) {
    return dateUtils.formatLocalDate;
  });
