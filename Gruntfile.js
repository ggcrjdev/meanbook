"use strict";
module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: [
        'Gruntfile.js', 
        'server/**/*.js', 
        'test/**/*.js'],
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
        src: ['test/**/*.js']
      }
    },
    karma: {  
      unit: {
        options: {
          frameworks: ['jasmine', 'requirejs'],
          browsers: ['PhantomJS'],
          basePath: 'web/',
          files: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-route/angular-route.min.js',
            {pattern: '*.js', included: false},
            {pattern: 'timeline/*.js', included: false},

            'test/test-main.js',
            {pattern: 'test/**/*.js', included: false}
          ],
          exclude: [],
          port: 9876,
          preprocessors: {},
          reporters: ['progress'],
          colors: true,
          autoWatch: true,
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
