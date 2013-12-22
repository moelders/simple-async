/**
 * Mocha test executor.
 *
 * @param {object} grunt Grunt object.
 */
module.exports = function(grunt) {
  grunt.registerTask('mocha', 'Executes global mocha to run tests', function() {
    var done = this.async(),
      exec = require('child_process').exec,
      mocha = exec('mocha');

    mocha.stdout.on('data', function(data) {
      grunt.log.write(data);
    });

    mocha.stderr.on('data', function(data) {
      grunt.log.error('\n', data);
    });

    mocha.on('exit', function(code) {
      done(code === 0);
    });
  });
};
