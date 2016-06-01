requirejs.config({
  basePath: './',
  paths: {
    jquery: '../bower_components/jquery/dist/jquery',
    angular: '../bower_components/angular/angular',
    angularRoute: '../bower_components/angular-route/angular-route',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap'
  },
  shim: {
    jquery: {exports: '$'}, 
    bootstrap: {deps: ['jquery']}, 
    angular: {exports: 'angular', deps: ['jquery']}, 
    angularRoute: {exports: 'ngRoute', deps: ['angular']}
  },
  deps: ['app.module']
});
