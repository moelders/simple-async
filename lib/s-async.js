(function() {
  var sAsync = {},
    root = this,
    presiousSAsync;

  function _endFunction(end) {
    function _emptyFunction() {}

    return (typeof end === 'function') ? end : _emptyFunction;
  }

  if (root != null) {
    presiousSAsync = root.sAsync;
  }

  /**
   * Returns the simple-async object without overwriting other one.
   *
   * @return {object} Simple-async object.
   */
  sAsync.noConflict = function() {
    root.sAsync = presiousSAsync;
    return sAsync;
  };

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
  sAsync.doSeries = function(methods, end) {
    var _end = _endFunction(end),
      methodsLength = methods && methods.length,
      correct = !!methodsLength,
      methodIndex = 0,
      i = 0;

    function _execute(methodIndex) {
      if (methodIndex < methodsLength) {
        methods[methodIndex++](_next);
      } else {
        _end();
      }
    }

    function _next(error) {
      if (typeof error === 'undefined') {
        _execute(methodIndex++);
      } else {
        _end(error);
      }
    }

    while (correct && (i < methodsLength)) {
      correct &= (typeof methods[i] === 'function');
      i++;
    }

    if (correct) {
      _next();
    } else {
      _next(false);
    }
  };

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
  sAsync.doParallel = function(methods, end) {
    var _end = _endFunction(end),
      endCalled = false,
      methodsLength = methods && methods.length,
      correct = !!methodsLength,
      finishedMethods = 0,
      i = 0;

    function _done(error) {
      var _error = (typeof error !== 'undefined'),
        _finished = (++finishedMethods === methodsLength);

      if (!endCalled && (_finished || _error)) {
        endCalled = true;
        if (_error) {
          _end(error);
        } else {
          _end();
        }
      }
    }

    while (correct && (i < methodsLength)) {
      correct &= (typeof methods[i] === 'function');
      i++;
    }

    if (correct) {
      i = 0;
      while (i < methodsLength) {
        methods[i++](_done);
      }
    } else {
      _end(false);
    }
  };

  // Make sAsync library visible.
  if ((typeof define !== 'undefined') && define.amd) { // AMD / RequireJS.
    define([], function() {
      return sAsync;
    });
  } else if ((typeof module !== 'undefined') && module.exports) { // NodeJS.
    module.exports = sAsync;
  } else { // Browser.
    root.sAsync = sAsync;
  }
}());
