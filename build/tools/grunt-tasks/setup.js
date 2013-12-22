/**
 * Pre-commit environment setup.
 *
 * @param {object} grunt Grunt object.
 */
module.exports = function(grunt) {
  grunt.registerTask('setup', 'Prepares the GIT pre-commit environment',
    function(hook) {
      var exec = require('child_process').exec,
        done = this.async();

      exec('git rev-parse --git-dir', function(error, stdout, stderr) {
        var gitPath = stdout.trim(),
          cmd = [
            'rm -f ' + gitPath + '/hooks/pre-commit',
            'cp ./build/tools/hooks/pre-commit ' + gitPath + '/hooks/',
            'chmod 777 ' + gitPath + '/hooks/pre-commit'
          ].join(' && ');

        exec(cmd, function(error) {
          console.log((error) ? 'Error preparing GIT pre-commit hooks.' :
            'GIT hooks installed successfully.');
          if (error) {
            done(false);
          } else {
            done(true);
          }
        });
      });
    }
  );
};
