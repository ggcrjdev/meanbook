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

  /*** Export ***/
  return {
    getCurrentHostName: getCurrentHostName
  };
});
