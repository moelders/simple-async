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
      lib: [
        'lib/**/*.js'
      ],
      build: [
        'build/**/*.js'
      ],
      test: [
        'test/**/*.js'
      ]
    },
    jshintOptions = {
      lib: {
        jshintrc: './lib/.jshintrc'
      },
      build: {
        jshintrc: './build/.jshintrc'
      },
      test: {
        jshintrc: './test/.jshintrc'
      }
    },
    gjslintOptions = {
      lib: {
        flags: [
          '--flagfile ./lib/.gjslintrc'
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  // Register grunt tasks.
  grunt.registerTask('test', ['simplemocha:unit']);
  grunt.registerTask('build', ['test', 'publish', 'uglify:lib']);

  // Grunt tasks configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), // Project properties.
    header: grunt.file.read('./build/config/header.txt'), // Library header.
    simplemocha: { // Test runner.
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
    uglify: { // Compress Javascript source-code.
      options: {
        banner: '<%= header %>',
        output: {
          'ie_proof': true,
          'comments': /^!/gi
        },
        compress: {
          'sequences': true,
          'properties': true,
          'dead_code': true,
          'drop_debugger': true,
          'conditionals': true,
          'comparisons': true,
          'booleans': true,
          'loops': true,
          'hoist_funs': true,
          'if_return': true,
          'join_vars': true,
          'cascade': true,
          'side_effects': true
        }
      },
      lib: {
        files: {
          'publish/s-async.min.js': ['lib/s-async.js']
        }
      }
    },
    jshint: { // Static Javascript code analyzer.
      lib: {
        options: jshintOptions.lib,
        files: {
          src: sources.lib
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
      lib: {
        options: gjslintOptions.lib,
        src: sources.lib
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
