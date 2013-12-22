(function() {
  var sAsync = {},
    presiousSAsync = null,
    root = this;

  function emptyFunction() {}

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
   * @param {function} end Ending method: 'function(result) {}', the result
   *   parameter can be 'true' or 'false' according to a success or unsuccess
   *   result respectively.
   */
  sAsync.doSeries = function(methods, end) {
    var _end = (typeof end === 'function') ? end : emptyFunction,
      correct = methods && !!methods.length,
      methodIndex = 0,
      i = 0;

    function _execute(methodIndex) {
      if (methodIndex < methods.length) {
        methods[methodIndex++](_next);
      } else {
        _end(true);
      }
    }

    function _next(error) {
      if (typeof error === 'undefined') {
        _execute(methodIndex++);
      } else {
        _end(false);
      }
    }

    while (correct && (i < methods.length)) {
      correct &= (typeof methods[i] === 'function');
      i++;
    }

    _next(correct ? undefined : 'error');
  };

  /**
   * Executes asynchronously the array of methods in parallel and finally call
   * the end method with the result parameter. If there is any error, the 'end'
   * method will be executed before finishing the remaining unfinished methods.
   *
   * @param {function[]} methods Array of methods, example: 'function(next) {}',
   *   the 'next' parameter should be invoqued after method is completed to
   *   execute the next method, if it has a parameter there is an error.
   * @param {function} end Ending method: 'function(result) {}', the result
   *   parameter can be 'true' or 'false' according to a success or unsuccess
   *   result respectively.
   */
  sAsync.doParallel = function(methods, end) {
    var _end = (typeof end === 'function') ? end : emptyFunction,
      endCalled = false,
      correct = methods && !!methods.length,
      finishedMethods = 0,
      i = 0,
      lng = correct ? methods.length : 0;

    function _checkComplete(error) {
      var _error = (typeof error !== 'undefined'),
        _finished = (++finishedMethods === lng);

      if (!endCalled && (_finished || _error)) {
        endCalled = true;
        _end(_finished && !_error);
      }
    }

    while (correct && (i < lng)) {
      correct &= (typeof methods[i] === 'function');
      i++;
    }

    if (correct) {
      for (i = 0, lng = lng; i < lng; i++) {
        methods[i](_checkComplete);
      }
    } else {
      _end(false);
    }
  };

  // Make sAsync library visible.
  if (typeof define !== 'undefined' && define.amd) { // AMD / RequireJS.
    define([], function() {
      return sAsync;
    });
  } else if (typeof module !== 'undefined' && module.exports) { // NodeJS.
    module.exports = sAsync;
  } else { // Browser (via <script> tag).
    root.sAsync = sAsync;
  }
}());
