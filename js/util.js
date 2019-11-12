'use strict';

(function () {
  var Index = {
    NODE: 0,
    TYPE_LISTENER: 1,
    HANDLER: 2
  };
  var DEBOUNCE_INTERVAL = 500;

  var pluralize = function (number, arr) {
    var remainder = number % 100;
    if (remainder >= 5 && remainder <= 20) {
      return arr[2];
    }
    remainder = number % 10;
    if (remainder === 1) {
      return arr[0];
    }
    if (remainder >= 2 && remainder <= 4) {
      return arr[1];
    }
    return arr[2];
  };

  var setHandlers = function (arr) {
    arr.forEach(function (key) {
      key[Index.NODE].addEventListener(key[Index.TYPE_LISTENER], key[Index.HANDLER]);
    });
  };

  var removeHandlers = function (arr) {
    arr.forEach(function (key) {
      key[Index.NODE].removeEventListener(key[Index.TYPE_LISTENER], key[Index.HANDLER]);
    });
  };

  var findNodes = function (obj) {
    var nodes = {};
    var keys = Object.keys(obj);
    keys.forEach(function (key) {
      nodes[key] = document.querySelector(obj[key]);
    });
    return nodes;
  };

  var debounce = function (cb) {
    var lastTimeout = null;
    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      lastTimeout = setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    pluralize: pluralize,
    findNodes: findNodes,
    setHandlers: setHandlers,
    debounce: debounce,
    removeHandlers: removeHandlers
  };
})();
