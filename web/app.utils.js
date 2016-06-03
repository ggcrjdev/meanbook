"use strict";
define([], function() {
  function getCurrentHostName() {
    var host;
    if (window.location.host) {
      host = window.location.protocol + '//'+ window.location.host;
    } else if (document.URL) {
      var parser = document.createElement('a');
      parser.href = document.URL;
      host = parser.protocol + '//'+ parser.host;
    } else {
      throw Error('currentHostName not found.');
    }
    return host;
  }

  function formatTimestamp(timestamp, style) {
    var timestampFormatted = null;
    if (timestamp) {
      var dateToFormat = new Date(timestamp);
      var formattedDate = dateToFormat.toISOString();
      if (style === 'date') {
        timestampFormatted = formattedDate.split('T')[0];
      } else if (style === 'datetime') {
        timestampFormatted = formattedDate.replace('T', ' ').split('.')[0];
      } else {
        timestampFormatted = formattedDate.replace('T', ' ').split('.')[0];
      }
    }
    return timestampFormatted;
  }

  /*** Export ***/
  return {
    getCurrentHostName: getCurrentHostName,
    formatTimestamp: formatTimestamp
  };
});
