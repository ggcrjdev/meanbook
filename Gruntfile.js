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
    karma: {  
      unit: {
        options: {
          frameworks: ['jasmine', 'requirejs'],
          browsers: ['PhantomJS'],
          files: [
            'web/test/index.test.html',
            'web/test/*.js'
          ],
          exclude: [],
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
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['jshint', 'karma']);
};
