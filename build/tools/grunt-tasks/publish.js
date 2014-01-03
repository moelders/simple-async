/**
 * Publish the uncompressed library adding the header.
 *
 * @param {object} grunt Grunt object.
 */
module.exports = function(grunt) {
  grunt.registerTask('publish', 'Publish the uncompressed library', function() {
    var fs = require('fs'),
      done = this.async(),
      filename = 's-async.js',
      publishFolder = './publish/',
      header = grunt.config.get('header');

    fs.readFile('./lib/' + filename, 'utf8', function(error, data) {
      if (!error) {
        !fs.existsSync(publishFolder) && fs.mkdirSync(publishFolder);

        fs.writeFile(publishFolder + filename, [header, data].join(''), 'utf8',
          function(error) {
            if (!error) {
              done(true);
            } else {
              done(error);
            }
          }
        );
      } else {
        done(error);
      }
    });
  });
};
