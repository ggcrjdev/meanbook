'use strict';

var sourcePath = 'web/src/';
var distPath = 'web/dist/';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: {
        src: [distPath]
      }
    },
    copy: {
      dist: {
        files: [{
            expand: true,
            cwd: sourcePath,
            src: ['**'],
            dest: distPath
          }
        ]
      }
    },
    cssmin: {
      dist: {
        files: [{
            expand: true,
            cwd: distPath,
            src: '**/*.css',
            dest: distPath
          }
        ]
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: [{
            expand: true,
            cwd: distPath,
            src: '**/*.js',
            dest: distPath
          }
        ]
      },
      lib: {
        files: {
          'web/lib/requirejs/require.js': ['web/lib/requirejs/require.js']
        }
      },
    },

    env: {
      options: {},
      dev: {
        NODE_ENV: 'development',
        TZ: 'UTC'
      },
      build: {
        NODE_ENV: 'production'
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      source: ['Gruntfile.js', 'server/src/**/*.js', 'web/src/**/*.js'],
      test: ['server/test/**/*.js', 'web/test/**/*.js']
    },
    jscs: {
      options: {
        config: '.jscsrc'
      },
      src: ['<%= jshint.source %>', '<%= jshint.test %>']
    },
    csslint: {
      web: {
        options: {
          csslintrc: 'web/.csslintrc'
        },
        src: ['web/src/**/*.css']
      }
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
    watch: {
      source: {
        files: '<%= jshint.source %>',
        tasks: ['jshint:source']
      },
      test: {
        files: '<%= jshint.test %>',
        tasks: ['jshint:test']
      },
      css: {
        files: '<%= csslint.web.src %>',
        tasks: ['csslint'],
        options: {
          livereload: {
            host: 'localhost',
            port: 3000
          }
        }
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
            'web/test/mainTest.js',
            {pattern: 'web/src/**/*.js', included: false},
            {pattern: 'web/test/**/*Test.js', included: false},

            {pattern: 'web/lib/jquery/dist/jquery.js', included: false},
            {pattern: 'web/lib/angular/angular.js', included: false},
            {pattern: 'web/lib/angular-route/angular-route.js', included: false},
            {pattern: 'web/lib/bootstrap/dist/js/bootstrap.js', included: false},
            {pattern: 'web/lib/angular-mocks/angular-mocks.js', included: false}
          ],
          exclude: [
            'web/src/main.js'
          ],

          // level of logging
          // possible values: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
          // logLevel: 'LOG_DEBUG',
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

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('codequality', ['jshint', 'jscs', 'csslint']);
  grunt.registerTask('test', ['env:dev', 'mochaTest', 'karma', 'codequality']);
  grunt.registerTask('build', ['clean:dist', 'copy:dist', 'cssmin', 'uglify']);
};
