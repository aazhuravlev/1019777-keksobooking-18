'use strict';

(function () {
  var main = function () {
    window.addEventListener('load', window.data.load);
    window.form.addHandlers();
    window.filter.addHandlers();
  };

  main();
})();
