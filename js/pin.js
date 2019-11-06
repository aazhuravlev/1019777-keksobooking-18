'use strict';

(function () {
  var ENTER_KEYCODE = 13;

  var MAIN_PIN = {
    width: 62,
    height: 22,
    triangleHeight: 22,
    startX: 570,
    startY: 375
  };

  var MAP_BORDER = {
    minX: 0 - (MAIN_PIN.width / 2),
    maxX: 1200 - (MAIN_PIN.width / 2),
    minY: 130,
    maxY: 630
  };

  MAIN_PIN.fullHeight = MAIN_PIN.height + MAIN_PIN.triangleHeight;

  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  Coordinate.prototype.setX = function (x) {
    this.x = x;
  };

  Coordinate.prototype.setY = function (y) {
    this.y = y;
  };

  var SELECTORS_DATA = {
    mainPin: '.map__pin--main',
    pins: '.map__pins',
    pinTemplate: '#pin',
  };

  var NODES = window.util.findNodes(SELECTORS_DATA);
  NODES.mapPin = NODES.pinTemplate.content.querySelector('.map__pin');

  var mainPinCoordinates = function () {
    var x = MAIN_PIN.startX + MAIN_PIN.width / 2;
    var y = MAIN_PIN.startY + MAIN_PIN.height / 2;
    if (!document.querySelector('.map--faded')) {
      y = MAIN_PIN.startY + MAIN_PIN.fullHeight;
    }
    return x + ', ' + y;
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
    arr.forEach(function (item, i) {
      NODES.pins.appendChild(preparePin(item, i));
    });
    NODES.renderedPins = NODES.pins.querySelectorAll('[type]');
    return NODES.renderedPins;
  };

  var removeActivePin = function () {
    var activeMapPin = NODES.pins.querySelector('.map__pin--active');
    if (activeMapPin) {
      activeMapPin.classList.remove('map__pin--active');
    }
  };

  var pinClickHandler = function (evt) {
    var idx = evt.target.getAttribute('data-id') || evt.target.parentNode.getAttribute('data-id');
    if (idx) {
      window.card.remove();
      window.card.render(window.data.getFiltered()[idx]);
      NODES.renderedPins[idx].classList.add('map__pin--active');
    }
  };

  var getBorderMovingMainPin = function (coordinate, min, max) {
    if (coordinate <= min) {
      return min;
    } else if (coordinate >= max) {
      return max;
    }
    return coordinate;
  };

  var dragHandler = function (evt) {
    evt.preventDefault();

    var startCoords = new Coordinate(evt.clientX, evt.clientY);

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);

      startCoords.setX(moveEvt.clientX);
      startCoords.setY(moveEvt.clientY);

      var actualCoords = new Coordinate(getBorderMovingMainPin(NODES.mainPin.offsetLeft - shift.x, MAP_BORDER.minX, MAP_BORDER.maxX), getBorderMovingMainPin(NODES.mainPin.offsetTop - shift.y, MAP_BORDER.minY, MAP_BORDER.maxY));
      var triangleCoords = new Coordinate(actualCoords.x - shift.x + MAIN_PIN.width / 2, actualCoords.y + MAIN_PIN.fullHeight);

      NODES.mainPin.style.top = actualCoords.y + 'px';
      NODES.mainPin.style.left = actualCoords.x + 'px';
      window.form.nodes.inputAddress.value = triangleCoords.x + ', ' + triangleCoords.y;
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var mapEnterPressHandler = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      window.dom.openMap();
      NODES.mainPin.removeEventListener('keydown', mapEnterPressHandler);
      NODES.mainPin.removeEventListener('click', mainPinClickHandler);
    }
  };

  var mainPinClickHandler = function () {
    NODES.mainPin.removeEventListener('click', mainPinClickHandler);
    NODES.mainPin.removeEventListener('keydown', mapEnterPressHandler);
    window.dom.openMap();
  };

  var HANDLERS_DATA = [
    [NODES.mainPin, 'click', mainPinClickHandler],
    [NODES.mainPin, 'keydown', mapEnterPressHandler]
  ];

  var addHandlers = function () {
    window.util.setHandlers(HANDLERS_DATA);
  };

  window.pin = {
    render: renderPins,
    removeActive: removeActivePin,
    mainPinCoordinates: mainPinCoordinates,
    mainPin: MAIN_PIN,
    nodes: NODES,
    addHandlers: addHandlers,
    mainPinClickHandler: mainPinClickHandler,
    mapEnterPressHandler: mapEnterPressHandler,
    clickHandler: pinClickHandler,
    dragHandler: dragHandler
  };
})();
