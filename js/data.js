'use strict';

(function () {
  var PINS_COUNT = 8;
  var HOTEL_PHOTOS_COUNT = 3;
  var TYPES = {palace: 'Дворец', flat: 'Квартира', house: 'Дом', bungalo: 'Бунгало'};
  var TIME = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var MIN_PRICE = 1;
  var MAX_PRICE = 50000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 3;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 3;
  var LOCATION = {
    minX: 0,
    maxX: 1138,
    minY: 130,
    maxY: 630
  };

  var createList = function (quantity, part1, part2) {
    var arr = [];
    for (var i = 1; i <= quantity; i++) {
      arr.push(part1 + i + part2);
    }
    return arr;
  };

  var AVATARS = createList(PINS_COUNT, 'img/avatars/user0', '.png');
  var TITLES = createList(PINS_COUNT, 'title', '');
  var PHOTOS = createList(HOTEL_PHOTOS_COUNT, 'http://o0.github.io/assets/images/tokyo/hotel', '.jpg');
  var DESCRIPTIONS = createList(PINS_COUNT, 'description', '');

  var getPinsData = function (quantity) {
    var pinsDesc = [];
    var avatars = AVATARS.slice(0);
    var titles = TITLES.slice(0);
    var TYPE_KEYS = window.utils.getRandomItem(Object.keys(TYPES));
    var descriptions = DESCRIPTIONS.slice(0);

    for (var i = 0; i < quantity; i++) {
      var locationX = window.utils.getRandomBetween(LOCATION.minX, LOCATION.maxX);
      var locationY = window.utils.getRandomBetween(LOCATION.minY, LOCATION.maxY);
      pinsDesc.push({
        author: {
          avatar: window.utils.spliceRandomItem(avatars),
        },
        offer: {
          title: window.utils.spliceRandomItem(titles),
          adress: locationX + ', ' + locationY,
          price: window.utils.getRandomBetween(MIN_PRICE, MAX_PRICE),
          type: TYPE_KEYS,
          rooms: window.utils.getRandomBetween(MIN_ROOMS, MAX_ROOMS),
          guests: window.utils.getRandomBetween(MIN_GUESTS, MAX_GUESTS),
          checkin: window.utils.getRandomItem(TIME),
          checkout: window.utils.getRandomItem(TIME),
          features: window.utils.getRandomSlice(FEATURES),
          description: window.utils.spliceRandomItem(descriptions),
          photos: PHOTOS
        },
        location: {
          x: locationX + 'px',
          y: locationY + 'px'
        }
      });
    }
    return pinsDesc;
  };

  var DESC_PINS = getPinsData(PINS_COUNT);

  window.data = {
    descPins: DESC_PINS,
    location: LOCATION,
    types: TYPES,
    photos: PHOTOS,
    time: TIME
  };
})();
