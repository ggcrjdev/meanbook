'use strict';
angular.module('meanBookModule')
  .service('dateUtils', function() {
    function formatTimestamp(timestamp, style) {
      var timestampFormatted = null;
      if (timestamp) {
        var dateToFormat = new Date(timestamp);
        var formattedDate = dateToFormat.toISOString();
        if (!style) {
          timestampFormatted = formattedDate.replace('T', ' ').split('.')[0];
        } else if (style === 'datetime') {
          timestampFormatted = formattedDate.replace('T', ' ').split('.')[0];
        } else if (style === 'date') {
          timestampFormatted = formattedDate.split('T')[0];
        } else {
          throw Error('Style [' + style + '] is not supported.');
        }
      }
      return timestampFormatted;
    }

    function formatLocalDate(timestamp, style) {
      var formattedDate = null;
      if (typeof timestamp === 'number' || typeof timestamp === 'string') {
        var localDate = new Date(timestamp);
        if (!style)
          style = 'datetime';
        if (style === 'datetime' || style === 'date') {
          var tzo = -localDate.getTimezoneOffset();
          var pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
          };

          formattedDate = localDate.getFullYear() + '-' + pad(localDate.getMonth() + 1);
          formattedDate += '-' + pad(localDate.getDate());
          if (style === 'datetime') {
            formattedDate += ' ' + pad(localDate.getHours()) + ':' + pad(localDate.getMinutes());
            formattedDate += ':' + pad(localDate.getSeconds());
          }
        } else {
          throw Error('Style [' + style + '] is not supported.');
        }
      }
      return formattedDate;
    }

    return {
      formatTimestamp: formatTimestamp,
      formatLocalDate: formatLocalDate
    };
  });
