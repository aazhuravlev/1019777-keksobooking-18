'use strict';

(function () {
  var ENTER_KEYCODE = 13;

  var MainPin = {
    WIDTH: 62,
    HEIGHT: 22,
    TRIANGLE_HEIGHT: 22,
    START_X: 570,
    START_Y: 375
  };

  var MapBorder = {
    MIN_X: 0 - (MainPin.WIDTH / 2),
    MAX_X: 1200 - (MainPin.WIDTH / 2)
  };

  MainPin.FULL_HEIGHT = MainPin.HEIGHT + MainPin.TRIANGLE_HEIGHT;
  MapBorder.MIN_Y = 130 - MainPin.FULL_HEIGHT;
  MapBorder.MAX_Y = 630 - MainPin.FULL_HEIGHT;

  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  Coordinate.prototype.setXY = function (x, y) {
    this.x = x;
    this.y = y;
  };

  var renderedPins;
  var startCoords;

  var Nodes = {
    MAIN_PIN: document.querySelector('.map__pin--main'),
    PINS: document.querySelector('.map__pins'),
    PIN_TEMPLATE: document.querySelector('#pin'),
  };

  Nodes.MAP_PIN = Nodes.PIN_TEMPLATE.content.querySelector('.map__pin');

  var mainPinCoordinates = function () {
    var x = MainPin.START_X + MainPin.WIDTH / 2;
    var y = MainPin.START_Y + MainPin.HEIGHT / 2;
    if (!document.querySelector('.map--faded')) {
      y = MainPin.START_Y + MainPin.FULL_HEIGHT;
    }
    return x + ', ' + y;
  };

  var getLocation = function (location) {
    return 'left: ' + location.x + 'px;' + ' top: ' + location.y + 'px;';
  };

  var preparePin = function (item, i) {
    var pinElement = Nodes.MAP_PIN.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.setAttribute('style', getLocation(item.location));
    pinElement.setAttribute('data-id', i);
    pinImage.src = item.author.avatar;
    pinImage.alt = item.offer.title;
    return pinElement;
  };

  var removePins = function () {
    if (renderedPins) {
      renderedPins.forEach(function (pin) {
        pin.remove();
      });
    }
  };

  var renderPins = function (arr) {
    removePins();
    var fragment = document.createDocumentFragment();
    arr.forEach(function (item, i) {
      if (item.offer) {
        fragment.appendChild(preparePin(item, i));
      }
    });
    Nodes.PINS.appendChild(fragment);
    renderedPins = Nodes.PINS.querySelectorAll('[type]');
  };

  var removeActivePin = function () {
    var activeMapPin = Nodes.PINS.querySelector('.map__pin--active');
    if (activeMapPin) {
      activeMapPin.classList.remove('map__pin--active');
    }
  };

  var pinClickHandler = function (evt) {
    var idx = evt.target.getAttribute('data-id') || evt.target.parentNode.getAttribute('data-id');
    if (idx) {
      window.card.removeHandler();
      window.card.render(window.data.getFiltered()[idx]);
      renderedPins[idx].classList.add('map__pin--active');
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

  var startCoordsHandler = function (evt) {
    startCoords = new Coordinate(evt.clientX, evt.clientY);
    return startCoords;
  };

  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);

    startCoords.setXY(moveEvt.clientX, moveEvt.clientY);

    var actualCoords = new Coordinate(getBorderMovingMainPin(Nodes.MAIN_PIN.offsetLeft - shift.x, MapBorder.MIN_X, MapBorder.MAX_X), getBorderMovingMainPin(Nodes.MAIN_PIN.offsetTop - shift.y, MapBorder.MIN_Y, MapBorder.MAX_Y));
    var triangleCoords = new Coordinate(actualCoords.x - shift.x + MainPin.WIDTH / 2, actualCoords.y + MainPin.FULL_HEIGHT);

    Nodes.MAIN_PIN.style.top = actualCoords.y + 'px';
    Nodes.MAIN_PIN.style.left = actualCoords.x + 'px';
    window.form.nodes.INPUT_ADDRESS.value = triangleCoords.x + ', ' + triangleCoords.y;
  };

  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault();
    window.util.removeHandlers(dragHandlersData);
  };

  var dragHandlersData = [
    [document, 'mousemove', mouseMoveHandler],
    [document, 'mouseup', mouseUpHandler]
  ];

  var dragHandler = function (evt) {
    var prevEvt = evt;
    evt.preventDefault();

    startCoordsHandler(evt);
    mouseMoveHandler(prevEvt);
    mouseUpHandler(prevEvt);

    window.util.setHandlers(dragHandlersData);
  };

  var mapEnterPressHandler = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      window.util.removeHandlers(handlersData);
      window.dom.openMap();
    }
  };

  var mainPinClickHandler = function () {
    window.util.removeHandlers(handlersData);
    window.dom.openMap();
  };

  var handlersData = [
    [Nodes.MAIN_PIN, 'click', mainPinClickHandler],
    [Nodes.MAIN_PIN, 'keydown', mapEnterPressHandler]
  ];

  var addHandlers = function () {
    window.util.setHandlers(handlersData);
  };

  window.pin = {
    render: renderPins,
    remove: removePins,
    removeActive: removeActivePin,
    mainPinCoordinates: mainPinCoordinates,
    main: MainPin,
    nodes: Nodes,
    addHandlers: addHandlers,
    mainPinClickHandler: mainPinClickHandler,
    mapEnterPressHandler: mapEnterPressHandler,
    clickHandler: pinClickHandler,
    dragHandler: dragHandler
  };
})();
