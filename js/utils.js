'use strict';

(function () {
  var getRandomBetween = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getRandomIndex = function (max) {
    return getRandomBetween(0, max - 1);
  };

  var spliceRandomItem = function (arr) {
    return arr.splice(getRandomIndex(arr.length - 1), 1);
  };

  var getRandomItem = function (arr) {
    return arr[getRandomIndex(arr.length)];
  };

  var getRandomSlice = function (arr) {
    return arr.slice(0, 2 + getRandomIndex(arr.length - 2));
  };

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

  window.utils = {
    getRandomBetween: getRandomBetween,
    spliceRandomItem: spliceRandomItem,
    getRandomItem: getRandomItem,
    getRandomSlice: getRandomSlice,
    pluralize: pluralize
  };
})();
