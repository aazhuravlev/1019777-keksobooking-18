'use strict';

(function () {
  var main = function () {
    window.addEventListener('load', window.data.load(window.pin.addHandlers));
    window.form.setDisabledStatus();
  };

  main();
})();
