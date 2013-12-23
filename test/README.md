simple-async: _test_
====================

The test folder contains the files for testing. The test framework used is [_mocha_](http://visionmedia.github.io/mocha/).

_Mocha_ is configured to be run on _NodeJS_ through the next two [_Grunt_](http://gruntjs.com) tasks:
* _mocha_: project build-in tool.
* _simple-mocha_: dependency installed via [_npm_](https://npmjs.org/).

The test framework will run all the specification files located in the folder: ``test/specs/**/`` and matching the name ``*.spec.js``.

In order to facilitate the testing work, the [_chai_](http://chaijs.com/) library is set to use _expect_ expectations, and also the mocks library [_sinon_](http://sinonjs.org/),

The folder structure:
* **_test_**
   * _config_
     * mocha-globals.js
   * _libs_
      * chai.js
      * mocha.js
   * _specs_
      * _unit_
         * *.spec.js
   * .gjslintrc
   * .jshintrc
   * mocha.opts
