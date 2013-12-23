simple-async
============

Very light and simple _Javascript_ library to execute asynchronous methods in series or in parallel. Less than 1KB for the minified version!

## Getting started

This library requires [_NodeJS v.0.10.x_](http://nodejs.org/) in order to build the simple-async publish version, and [_Grunt v.0.4.1_](http://gruntjs.com/). Both of them preferable installed globally.

Install _Grunt_ client globally:
> npm install -g grunt-cli

Make a copy of the _GIT_ repository:
> git clone git://github.com/jquery/jquery.git

Install the _NodeJS_ peer dependencies:
> npm install

Setup the _GIT pre-commit_ hooks:
> grunt setup

## Methods

There are three public methods:
* ``sAsync.noConflict()``: to coexist this library with another with the same public name ``sAsync``.
* ``sAsync.doSeries(methods, end)``: to execute a list of methods in series, no matter they are synchronous, asynchronous or a mix of them, the ``end`` callback will be executed at the end and return the result of the execution.
* ``sAsync.doParallel(methods, end)``: to execute a list of methods in parallel -similar to the ``doSeries`` method-.

Documentation:
```javascript
/**
 * Returns the simple-async object without overwriting other one.
 *
 * @return {object} Simple-async object.
 */
sAsync.noConflict = function() {};

/**
 * Executes asynchronously the array of methods in series and finally call the
 * end method with the result parameter. If there is any error, the 'end'
 * method will be executed before finishing the remaining unfinished methods.
 *
 * @param {function[]} methods Array of methods, example: 'function(next) {}',
 *   the 'next' parameter should be invoqued after method is completed to
 *   execute the next method, if it has a parameter there is an error.
 * @param {function} end Ending method: 'function(result) {}', the 'result'
 *   parameter can be undefined or other value according to a success or
 *   unsuccess result respectively.
 */
sAsync.doSeries = function(methods, end) {};

/**
 * Executes asynchronously the array of methods in parallel and finally call
 * the end method with the result parameter. If there is any error, the 'end'
 * method will be executed before finishing the remaining unfinished methods.
 *
 * @param {function[]} methods Array of methods, example: 'function(done) {}',
 *   the 'done' parameter should be invoqued after method is completed to
 *   execute the callback, if it has a parameter there is an error.
 * @param {function} end Ending method: 'function(result) {}', the 'result'
 *   parameter can be undefined or other value according to a success or
 *   unsuccess result respectively.
 */
sAsync.doParallel = function(methods, end) {};
```

## Usage

Next the explanation about how to use _simple-async_ in the browser and in the server.

### In the browser

After cloning the _GIT_ repository it is necessary to create the library for the browser. This _Grunt_ task creates the minified version and the development one with the header license:
> grunt build

The generated files are located in the ``publish`` folder:
* Development: ``publish/s-async.js``
* Minified: ``publish/s-async.min.js``

Use:
```html
<script src="s-async.js" type="text/javascript"></script>

<script type="text/javascript">
  sAsync.doSeries(...);
  sAsync.doParallel(...);
</script>
```

### In the server

Simply download the module _simple-async_ via [_npm_](http://npmjs.org/):
> npm install simple-async

Use:
```javascript
var sAsync = require('simple-async');

sAsync.doSeries(...);
sAsync.doParallel(...);
```

## Examples

* Executing asynchronous methods in series without error:
```javascript
sAsync.doSeries([
  function f1(next) {
    setTimeout(function(next) {
      // Do something.
      console.log('f1 finished');
      next();
    }, 100, next);
  },
  function f2(next) {
    setTimeout(function(next) {
      // Do something.
      console.log('f2 finished');
      next();
    }, 200, next);
  }
], function end(result) {
  // Finished, the result will be 'undefined'.
  console.log('finished:', result || 'ok');
});

// Output:
// 'f1 finished'
// 'f2 finished'
// 'finished: ok'
```

* Executing synchronous and asynchronous methods in series with error:
```javascript
sAsync.doSeries([
  function f1(next) {
    // Do something.
    console.log('f1 finished');
    next();
  },
  function f2(next) {
    setTimeout(function(next) {
      // Do something.
      console.log('f2 finished with error');
      next('error executing f2');
    }, 100, next);
  },
  function f3(next) {
    setTimeout(function(next) {
      // Do something.
      console.log('f3 finished');
      next();
    }, 200, next);
  }
], function end(result) {
  // Finished, the result will not be 'undefined'.
  console.log('finished:', result || 'ok');
});

// Output (f3 is never executed due to the f2 error):
// 'f1 finished'
// 'f2 finished with error'
// 'finished: error executing f2'
```

* Executing asynchronous methods in parallel without error:
```javascript
sAsync.doParallel([
  function f1(done) {
    console.log('f1 is the third to finish');
    setTimeout(function(done) {
      // Do something.
      console.log('f1 finished');
      done();
    }, 500, done);
  },
  function f2(done) {
    console.log('f2 is the first to finish');
    setTimeout(function(done) {
      // Do something.
      console.log('f2 finished');
      done();
    }, 100, done);
  },
  function f3(done) {
    console.log('f3 is the second to finish');
    setTimeout(function(done) {
      // Do something.
      console.log('f3 finished');
      done();
    }, 300, done);
  }
], function end(result) {
  // Finished, the result will be 'undefined'.
  console.log('finished:', result || 'ok');
});

// Output:
// 'f1 is the third to finish'
// 'f2 is the first to finish'
// 'f3 is the second to finish'
// 'f2 finished'
// 'f3 finished'
// 'f1 finished'
// 'finished: ok'
```

* Executing synchronous and asynchronous methods in parallel with error:
```javascript
sAsync.doParallel([
  function f1(done) {
    console.log('f1 is the third to finish');
    setTimeout(function(done) {
      // Do something.
      console.log('f1 finished');
      done();
    }, 500, done);
  },
  function f2(done) {
    console.log('f2 is the second to finish');
    setTimeout(function(done) {
      // Do something.
      console.log('f2 finished with error');
      done('error executing f2');
    }, 100, done);
  },
  function f3(done) {
    console.log('f3 is the first to finish');
    // Do something.
    console.log('f3 finished');
    done();
  }
], function end(result) {
  // Finished, the result will not be 'undefined'.
  console.log('finished:', result || 'ok');
});

// Output:
// 'f1 is the third to finish'
// 'f2 is the second to finish'
// 'f3 is the first to finish'
// 'f3 finished'
// 'f2 finished with error'
// 'finished: error executing f2'
// 'f1 finished'
```

## Running development tools
* Unit tests using _mocha_ framework:
> grunt test

* _Javascript_ linter tools:
   * _jshint_:
> grunt jshint

   * Google Closure Linter: _gjslint_
> grunt gjslint

## Contributing

In order to mantain this library, anybody can contribute to enhance it, to fix bugs and much more. Take care to:
* Backward compatibility.
* Coding style -use the _Grunt_ tasks: _jshint_ and _gjslint_-.
* Execute and maintain the unit-tests.

## Release History

* **v0.0.1**: initial version.
