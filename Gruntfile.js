/**
 * Gruntfile configuration.
 *
 * @param {object} grunt Grunt configuration.
 */
module.exports = function(grunt) {
  var sources = {
      grunt: [
        'Gruntfile.js'
      ],
      app: [
        'app/**/*.js'
      ],
      build: [
        'build/**/*.js'
      ],
      test: [
        'test/**/*.js'
      ]
    },
    jshintOptions = {
      app: {
        jshintrc: './app/.jshintrc'
      },
      build: {
        jshintrc: './build/.jshintrc'
      },
      test: {
        jshintrc: './test/.jshintrc'
      }
    },
    gjslintOptions = {
      app: {
        flags: [
          '--flagfile ./app/.gjslintrc'
        ]
      },
      build: {
        flags: [
          '--flagfile ./build/.gjslintrc'
        ]
      },
      test: {
        flags: [
          '--flagfile ./test/.gjslintrc'
        ]
      }
    };

  // Local defined grunt tasks.
  grunt.loadTasks('build/tools/grunt-tasks');

  // Load external grunt task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  // Register grunt tasks.
  grunt.registerTask('test', [
    'simplemocha:unit'
  ]);

  // Grunt tasks configuration.
  grunt.initConfig({
    simplemocha: {
      options: {
        globals: [
          'expect'
        ],
        timeout: 3000,
        ui: 'bdd',
        reporter: 'dot'
      },
      unit: {
        src: [
          'test/specs/unit/**/*.spec.js'
        ]
      }
    },
    jshint: { // Static Javascript code analyzer.
      app: {
        options: jshintOptions.app,
        files: {
          src: sources.app
        }
      },
      build: {
        options: jshintOptions.build,
        files: {
          src: sources.build.concat(sources.grunt)
        }
      },
      test: {
        options: jshintOptions.test,
        files: {
          src: sources.test
        }
      }
    },
    gjslint: { // Static Javascript code analyzer.
      options: {
        reporter: {
          name: 'console'
        }
      },
      app: {
        options: gjslintOptions.app,
        src: sources.app
      },
      build: {
        options: gjslintOptions.build,
        src: sources.build.concat(sources.grunt)
      },
      test: {
        options: gjslintOptions.test,
        src: sources.test
      }
    }
  });
};
