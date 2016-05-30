requirejs.config({
  basePath: './',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'angular': '../bower_components/angular/angular.min',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min'
  }, 
  shim: {
    'jquery': {exports: '$'}, 
    'angular': {exports: 'angular'},
    'bootstrap': {deps: ['jquery']}
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
