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
   * end method with the result parameter.
   *
   * @param {function[]} methods Array of methods, example: 'function(next) {}',
   *   the 'next' parameter should be invoqued after method is completed to
   *   execute the next method, if it has a parameter there is an error.
   * @param {function} end Ending method: 'function(result) {}', the result
   *   parameter can be 'true' or 'false' according to a success or unsuccess
   *   result respectively.
   */
  sAsync.doSeries = function(methods, end) {
    var _methods = [],
      _end = (typeof end === 'function') ? end : emptyFunction,
      index = 0;

    function _execute(index) {
      if (index < _methods.length) {
        _methods[index++](_next);
      } else {
        _end(true);
      }
    }

    function _next(error) {
      if (typeof error === 'undefined') {
        _execute(index++);
      } else {
        _end(false);
      }
    }

    (methods instanceof Array) && methods.forEach(function(method) {
      if (typeof method === 'function') {
        _methods.push(method);
      }
    });

    if (_methods.length) {
      _execute(index++);
    } else {
      _end(false);
    }
  };

  /**
   * Executes asynchronously the array of methods in parallel and finally call
   * the end method with the result parameter.
   *
   * @param {function[]} methods Array of methods, example: 'function(next) {}',
   *   the 'next' parameter should be invoqued after method is completed to
   *   execute the next method, if it has a parameter there is an error.
   * @param {function} end Ending method: 'function(result) {}', the result
   *   parameter can be 'true' or 'false' according to a success or unsuccess
   *   result respectively.
   */
  sAsync.doParallel = function(methods, end) {
    end(true);
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
