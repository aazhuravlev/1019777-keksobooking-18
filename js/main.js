'use strict';

(function () {
  var main = function () {
    window.addEventListener('load', window.data.load(window.pin.addHandlers));
    window.form.setStatusFieldsets(window.form.nodes.formFieldsets, 'add');
  };

  main();
})();
