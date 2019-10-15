'use strict';

(function () {
  var MAIN_PIN = {
    width: 62,
    height: 22,
    triangleHeight: 22,
    startX: 570,
    startY: 375
  };
  MAIN_PIN.fullHeight = MAIN_PIN.height + MAIN_PIN.triangleHeight;

  var SELECTORS_DATA = {
    mainPin: '.map__pin--main',
    pins: '.map__pins',
    pinTemplate: '#pin',
    filters: '.map__filters-container'
  };

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
    return 'left: ' + location.x + ';' + ' top: ' + location.y + ';';
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

  var renderPins = function (arr) {
    var fragment = document.createDocumentFragment();
    arr.forEach(function (item, i) {
      fragment.appendChild(preparePin(item, i));
    });
    return fragment;
  };

  var pinClickHandler = function (evt) {
    var idx = evt.target.getAttribute('data-id') || evt.target.parentNode.getAttribute('data-id');
    if (idx) {
      window.card.remove();
      window.card.nodes.map.insertBefore(window.card.prepare(window.data.propertyDesc[idx]), NODES.filters);
      window.card.nodes.map.querySelector('.popup__close').addEventListener('click', window.card.remove);
    }
  };

  var addHendlers = function () {
    NODES.pins.addEventListener('click', pinClickHandler);
  };

  window.pin = {
    render: renderPins,
    calcMainPinCoordinates: calcMainPinCoordinates,
    calcActiveMainPinCoordinates: calcActiveMainPinCoordinates,
    mainPin: MAIN_PIN,
    nodes: NODES,
    addHendlers: addHendlers
  };
})();
