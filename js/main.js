'use strict';

(function () {
  var main = function () {
    window.addEventListener('load', window.data.loadData);
    window.card.addHandlers();
    window.pin.addHandlers();
    window.form.addHandlers();
    window.filter.addHandlers();
  };

  main();
})();
