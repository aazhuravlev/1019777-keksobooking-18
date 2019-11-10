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
    MAX_X: 1200 - (MainPin.WIDTH / 2),
    MIN_Y: 130,
    MAX_Y: 630
  };

  MainPin.FULL_HEIGHT = MainPin.HEIGHT + MainPin.TRIANGLE_HEIGHT;

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

  var SelectorsData = {
    MAIN_PIN: '.map__pin--main',
    PINS: '.map__pins',
    PIN_TEMPLATE: '#pin',
  };

  var Nodes = window.util.findNodes(SelectorsData);
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
    var mapPins = Nodes.PINS.querySelectorAll('[type]');
    if (mapPins) {
      mapPins.forEach(function (pin) {
        pin.remove();
      });
    }
  };

  var renderPins = function (arr) {
    removePins();
    arr.forEach(function (item, i) {
      if (item.offer) {
        Nodes.PINS.appendChild(preparePin(item, i));
      }
    });
    Nodes.RENDERED_PINS = Nodes.PINS.querySelectorAll('[type]');
    return Nodes.RENDERED_PINS;
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
      window.card.remove();
      window.card.render(window.data.getFiltered()[idx]);
      Nodes.RENDERED_PINS[idx].classList.add('map__pin--active');
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

      var actualCoords = new Coordinate(getBorderMovingMainPin(Nodes.MAIN_PIN.offsetLeft - shift.x, MapBorder.MIN_X, MapBorder.MAX_X), getBorderMovingMainPin(Nodes.MAIN_PIN.offsetTop - shift.y, MapBorder.MIN_Y, MapBorder.MAX_Y));
      var triangleCoords = new Coordinate(actualCoords.x - shift.x + MainPin.WIDTH / 2, actualCoords.y + MainPin.FULL_HEIGHT);

      Nodes.MAIN_PIN.style.top = actualCoords.y + 'px';
      Nodes.MAIN_PIN.style.left = actualCoords.x + 'px';
      window.form.nodes.INPUT_ADDRESS.value = triangleCoords.x + ', ' + triangleCoords.y;
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
      Nodes.MAIN_PIN.removeEventListener('keydown', mapEnterPressHandler);
      Nodes.MAIN_PIN.removeEventListener('click', mainPinClickHandler);
    }
  };

  var mainPinClickHandler = function () {
    Nodes.MAIN_PIN.removeEventListener('click', mainPinClickHandler);
    Nodes.MAIN_PIN.removeEventListener('keydown', mapEnterPressHandler);
    window.dom.openMap();
  };

  var HANDLERS_DATA = [
    [Nodes.MAIN_PIN, 'click', mainPinClickHandler],
    [Nodes.MAIN_PIN, 'keydown', mapEnterPressHandler]
  ];

  var addHandlers = function () {
    window.util.setHandlers(HANDLERS_DATA);
  };

  window.pin = {
    render: renderPins,
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
