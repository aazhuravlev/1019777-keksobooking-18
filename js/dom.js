'use strict';

(function () {
  var ENTER_KEYCODE = 13;

  var mapEnterPressHandler = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openMap();
    }
  };

  var openMap = function () {
    window.card.nodes.map.classList.remove('map--faded');
    window.form.setStatusFieldsets(window.form.nodes.formFieldsets, 'remove');
    window.pin.render(window.data.getData());
    window.form.nodes.inputAddress.value = window.pin.calcActiveMainPinCoordinates();
    window.pin.nodes.mainPin.removeEventListener('click', openMap);
    window.pin.nodes.mainPin.addEventListener('mousedown', dragHandler);
  };

  var dragHandler = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var actualX = window.pin.nodes.mainPin.offsetLeft - shift.x;
      var actualY = window.pin.nodes.mainPin.offsetTop - shift.y;

      if (actualX <= window.data.mapBorder.minX) {
        actualX = window.data.mapBorder.minX;
      } else if (actualX >= window.data.mapBorder.maxX) {
        actualX = window.data.mapBorder.maxX;
      }
      if (actualY <= window.data.mapBorder.minY) {
        actualY = window.data.mapBorder.minY;
      } else if (actualY >= window.data.mapBorder.maxY) {
        actualY = window.data.mapBorder.maxY;
      }

      var triangleActualX = actualX - shift.x + window.pin.mainPin.width / 2;
      var triangleActualY = actualY + window.pin.mainPin.fullHeight;

      window.pin.nodes.mainPin.style.top = actualY + 'px';
      window.pin.nodes.mainPin.style.left = actualX + 'px';
      window.form.nodes.inputAddress.value = triangleActualX + ', ' + triangleActualY;
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var addHandlers = function () {
    window.pin.nodes.mainPin.addEventListener('mousedown', openMap);
    window.pin.nodes.mainPin.addEventListener('keydown', mapEnterPressHandler);
  };

  window.dom = {
    addHandlers: addHandlers
  };
})();
