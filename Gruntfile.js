"use strict";
module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: [
        'Gruntfile.js', 
        'server/**/*.js'],
      options: {
        jshintrc: true
      },
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'reports/mocha.txt', 
          quiet: false, 
          clearRequireCache: false
        },
        src: ['server/test/**/*.js']
      }
    },
    
    // @see: http://monicalent.com/blog/2015/02/11/karma-tests-angular-js-require-j/
    // @see: https://stackoverflow.com/questions/29636580/karma-test-runner-requirejs-404-error-not-serving-up-content
    karma: {  
      unit: {
        options: {
          frameworks: ['jasmine', 'requirejs'],

          // Start these browsers, currently available:
          // - Chrome
          // - ChromeCanary
          // - Firefox
          // - Opera (has to be installed with `npm install karma-opera-launcher`)
          // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
          // - PhantomJS
          // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
          browsers: ['PhantomJS'],
          basePath: '',
          files: [
            'web/test/test-main.js',
            {pattern: 'web/*.js', included: false},
            {pattern: 'web/timeline/*.js', included: false},
            {pattern: 'web/test/**/*.test.js', included: false},

            {pattern: 'web/bower_components/jquery/dist/jquery.js', included: false},
            {pattern: 'web/bower_components/angular/angular.js', included: false},
            {pattern: 'web/bower_components/angular-route/angular-route.js', included: false},
            {pattern: 'web/bower_components/bootstrap/dist/js/bootstrap.js', included: false},
            {pattern: 'web/bower_components/angular-mocks/angular-mocks.js', included: false}
          ],
          exclude: [
            'web/main.js'
          ],

          // level of logging
          // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
          //logLevel: 'LOG_DEBUG',
          port: 9876,
          reporters: ['progress'],
          colors: true,
          autoWatch: true,

          // Continuous Integration mode
          // if true, it capture browsers, run tests and exit
          singleRun: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('codequality', ['jshint']);
  grunt.registerTask('test', ['mochaTest', 'karma', 'codequality']);
};
