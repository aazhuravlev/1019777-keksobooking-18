'use strict';

var PINS_COUNT = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_OUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var MAP = document.querySelector('.map');
var PINS = document.querySelector('.map__pins');

var createList = function (quantity, part1, part2) {
  var arr = [];
  for (var i = 0; i < quantity; i++) {
    arr.push(part1 + (i + 1) + part2);
  }
  return arr;
};

var AVATARS = createList(PINS_COUNT, 'img/avatars/user0', '.png');
var TITLES = createList(PINS_COUNT, 'title', '');
var DESCRIPTIONS = createList(PINS_COUNT, 'description', '');
var PHOTOS = createList(PINS_COUNT, 'http://o0.github.io/assets/images/tokyo/hotel', '.jpg');

var SIMILAR_PINS_TEMPLATE = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var SIMILAR_CARDS_TEMPLATE = document.querySelector('#card')
.content
.querySelector('.map__card');

var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomItem = function (arr) {
  return arr.splice(Math.floor(Math.random() * arr.length), 1);
};

var getPins = function (quantity) {
  var pinsDesc = [];
  var avatars = AVATARS.slice(0);
  var titles = TITLES.slice(0);
  var descriptions = DESCRIPTIONS.slice(0);

  for (var i = 0; i < quantity; i++) {
    var types = TYPES.slice(0);
    var checkInOut = CHECKIN_OUT.slice(0);
    var checkInOutRandom = getRandomItem(checkInOut);
    var price = '' + getRandomIntInclusive(0, 100000) + '';
    var rooms = '' + getRandomIntInclusive(0, 10) + '';
    var guests = '' + getRandomIntInclusive(0, 10) + '';
    var features = FEATURES.slice(0);
    var locationX = '' + getRandomIntInclusive(0, 1200) + '';
    var locationY = '' + getRandomIntInclusive(130, 630) + '';
    pinsDesc.push({
      author: {
        avatar: getRandomItem(avatars),
      },
      offer: {
        title: getRandomItem(titles),
        adress: '' + locationX + ', ' + locationY + '',
        price: price,
        type: getRandomItem(types),
        rooms: rooms,
        guests: guests,
        checkin: checkInOutRandom,
        checkout: checkInOutRandom,
        features: getRandomItem(features),
        description: getRandomItem(descriptions),
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

var getLocation = function (arr) {
  return 'left: ' + arr.location.x + ';' + ' top: ' + arr.location.y + ';';
};

var preparePin = function (arr) {
  var pinElement = SIMILAR_PINS_TEMPLATE.cloneNode(true);
  var pinImage = pinElement.querySelector('img');

  pinElement.setAttribute('style', getLocation(arr));
  pinImage.src = arr.author.avatar;
  pinImage.alt = arr.offer.title;
  return pinElement;
};

var renderPins = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(preparePin(arr[i]));
  }
  return fragment;
};

var DESC_PINS = getPins(PINS_COUNT);
PINS.appendChild(renderPins(DESC_PINS));
MAP.classList.remove('map--faded');
