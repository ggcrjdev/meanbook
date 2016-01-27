requirejs.config({
  basePath: './',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'angular': '../bower_components/angular/angular.min'
  },
  shim: {
    'angular': {
      exports: 'angular'
    }
  },
  dev: {
    options: {
      optimize: 'none'
    }
  },
  release: {
    options: {
      optimize: 'uglify'
    }
  }
});

require(['app'], function(app) {});
