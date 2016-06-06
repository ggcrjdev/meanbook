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
          captureFile: 'results.txt', 
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
          basePath: './',
          files: [
            'web/test/test-main.js',
            {pattern: 'web/bower_components/**/*.js', included: false},
            {pattern: 'web/*.js', included: false},
            {pattern: 'web/timeline/*.js', included: false},
            {pattern: 'web/test/**/*.js', included: false}
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
