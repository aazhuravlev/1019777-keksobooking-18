'use strict';

(function () {
  var SIMILAR_PINS_TEMPLATE = document.querySelector('#pin');
  var MAP_PIN = SIMILAR_PINS_TEMPLATE.content.querySelector('.map__pin');

  var getLocation = function (location) {
    return 'left: ' + location.x + ';' + ' top: ' + location.y + ';';
  };

  var preparePin = function (item, i) {
    var pinElement = MAP_PIN.cloneNode(true);
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

  window.pins = {
    renderPins: renderPins
  };
})();
