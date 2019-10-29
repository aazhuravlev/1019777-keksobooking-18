'use strict';

(function () {
  var MAIN_PIN = {
    width: 62,
    height: 22,
    triangleHeight: 22,
    startX: 570,
    startY: 375
  };

  var MAP_BORDER = {
    minX: -31,
    maxX: 1169,
    minY: 130,
    maxY: 630
  };

  MAIN_PIN.fullHeight = MAIN_PIN.height + MAIN_PIN.triangleHeight;

  var SELECTORS_DATA = {
    mainPin: '.map__pin--main',
    pins: '.map__pins',
    pinTemplate: '#pin',
  };

  var PINS_QUANTITY = 5;

  var NODES = window.util.findNodes(SELECTORS_DATA);
  NODES.mapPin = NODES.pinTemplate.content.querySelector('.map__pin');

  var calcPinX = NODES.mainPin.offsetLeft + MAIN_PIN.width / 2;
  var calcPinY = NODES.mainPin.offsetTop + MAIN_PIN.height / 2;
  var calcActivePinY = NODES.mainPin.offsetTop + MAIN_PIN.fullHeight;

  var calcMainPinCoordinates = function () {
    return calcPinX + ', ' + calcPinY;
  };

  var calcActiveMainPinCoordinates = function () {
    return calcPinX + ', ' + calcActivePinY;
  };

  var getLocation = function (location) {
    return 'left: ' + location.x + 'px;' + ' top: ' + location.y + 'px;';
  };

  var preparePin = function (item, i) {
    var pinElement = NODES.mapPin.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.setAttribute('style', getLocation(item.location));
    pinElement.setAttribute('data-id', i);
    pinImage.src = item.author.avatar;
    pinImage.alt = item.offer.title;
    return pinElement;
  };

  var removePins = function () {
    var mapPins = NODES.pins.querySelectorAll('[type]');
    if (mapPins) {
      mapPins.forEach(function (pin) {
        pin.remove();
      });
    }
  };

  var renderPins = function (arr) {
    removePins();
    if (arr.length > PINS_QUANTITY) {
      arr.length = PINS_QUANTITY;
    }
    arr.forEach(function (item, i) {
      NODES.pins.appendChild(preparePin(item, i));
    });
  };

  var activePinRemove = function () {
    var activeMapPin = NODES.pins.querySelector('.map__pin--active');
    if (activeMapPin) {
      activeMapPin.classList.remove('map__pin--active');
    }
  };

  var pinClickHandler = function (evt) {
    var idx = evt.target.getAttribute('data-id') || evt.target.parentNode.getAttribute('data-id');
    if (idx) {
      window.card.remove();
      window.card.render(window.data.updateData()[idx]);
      NODES.pins.querySelectorAll('[type]')[idx].classList.add('map__pin--active');
    }
  };

  var setMainPinBorderMoving = function (coordinate, min, max) {
    if (coordinate <= min) {
      coordinate = min;
    } else if (coordinate >= max) {
      coordinate = max;
    }
    return coordinate;
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

      var triangleActualX = setMainPinBorderMoving(actualX, MAP_BORDER.minX, MAP_BORDER.maxX) - shift.x + window.pin.mainPin.width / 2;
      var triangleActualY = setMainPinBorderMoving(actualY, MAP_BORDER.minY, MAP_BORDER.maxY) + window.pin.mainPin.fullHeight;

      window.pin.nodes.mainPin.style.top = setMainPinBorderMoving(actualY, MAP_BORDER.minY, MAP_BORDER.maxY) + 'px';
      window.pin.nodes.mainPin.style.left = setMainPinBorderMoving(actualX, MAP_BORDER.minX, MAP_BORDER.maxX) + 'px';
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
    NODES.mainPin.removeEventListener('mousedown', window.dom.openMap);
    NODES.mainPin.addEventListener('mousedown', dragHandler);
    NODES.pins.addEventListener('click', pinClickHandler);
  };

  window.pin = {
    render: renderPins,
    activeRemove: activePinRemove,
    calcMainPinCoordinates: calcMainPinCoordinates,
    calcActiveMainPinCoordinates: calcActiveMainPinCoordinates,
    mainPin: MAIN_PIN,
    nodes: NODES,
    addHandlers: addHandlers
  };
})();
