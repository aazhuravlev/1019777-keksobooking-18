'use strict';

(function () {
  var main = function () {
    window.dom.setStatusFormFieldsets(window.dom.nodes.formFieldsets, 'add');
    window.dom.nodes.pins.addEventListener('click', window.dom.pinClickHandler);
    window.dom.nodes.map.addEventListener('keydown', window.dom.removeMapCardKeydownHandler);
    window.dom.nodes.adTitle.addEventListener('change', window.dom.adTitleChangeHandler);
    window.dom.nodes.typeSelect.addEventListener('change', window.dom.typeSelectChangeHandler);
    window.dom.nodes.pricePerNight.addEventListener('change', window.dom.pricePerNightHandler);
    window.dom.nodes.roomSelect.addEventListener('change', window.dom.changeRoomsHandler);
    window.dom.nodes.timeInSelect.addEventListener('change', window.dom.timeInSelectHandler);
    window.dom.nodes.timeOutSelect.addEventListener('change', window.dom.timeOutSelectHandler);
    window.dom.nodes.inputAddress.value = window.dom.calcMainPinCoordinates();
    window.dom.nodes.mainPin.addEventListener('mousedown', window.dom.dragHandler);
    window.dom.nodes.mainPin.addEventListener('keydown', window.dom.mapEnterPressHendler);
    window.dom.nodes.formReset.addEventListener('click', window.dom.formReset);
  };

  main();
})();
