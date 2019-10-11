'use strict';

(function () {
  var main = function () {
    window.setStatusFormFieldsets(window.NODES.formFieldsets, 'add');
    window.NODES.pins.addEventListener('click', window.pinClickHandler);
    window.NODES.map.addEventListener('keydown', window.removeMapCardKeydownHandler);
    window.NODES.adTitle.addEventListener('change', window.adTitleChangeHandler);
    window.NODES.typeSelect.addEventListener('change', window.typeSelectChangeHandler);
    window.NODES.pricePerNight.addEventListener('change', window.pricePerNightHandler);
    window.NODES.roomSelect.addEventListener('change', window.changeRoomsHandler);
    window.NODES.timeInSelect.addEventListener('change', window.timeInSelectHandler);
    window.NODES.timeOutSelect.addEventListener('change', window.timeOutSelectHandler);
    window.NODES.inputAddress.value = window.calcMainPinCoordinates();
    window.NODES.mainPin.addEventListener('keydown', window.mapEnterPressHendler);
    window.NODES.mainPin.addEventListener('mousedown', window.openMap);
    window.NODES.formReset.addEventListener('click', window.formReset);
  };

  main();
})();
