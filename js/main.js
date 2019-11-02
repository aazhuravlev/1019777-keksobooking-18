'use strict';

(function () {
  var main = function () {
    window.addEventListener('load', window.data.load);
    window.card.addHandlers();
    window.form.addHandlers();
    window.filter.addHandlers();
  };

  main();
})();
