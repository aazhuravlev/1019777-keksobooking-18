'use strict';

var PINS_COUNT = 8;
var AVATARS = ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'];
var TITLES = ['title1', 'title2', 'title3', 'title4', 'title5', 'title6', 'title7', 'title8'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_OUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTIONS = ['description1', 'description2', 'description3', 'description4', 'description5', 'description6', 'description7', 'description8'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var MAP = document.querySelector('.map');
MAP.classList.remove('map--faded');
var PINS = document.querySelector('.map__pins');

var SIMILAR_PINS_TEMPLATE = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

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

var renderPins = function (arr) {
  var pinElement = SIMILAR_PINS_TEMPLATE.cloneNode(true);

  pinElement.setAttribute('style', getLocation(arr));
  pinElement.querySelector('img').setAttribute('src', arr.author.avatar, 'alt', arr.offer.title);
  return pinElement;
};

var pasteFragments = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderPins(arr[i]));
  }
  return fragment;
};

var DESC_PINS = getPins(PINS_COUNT);
PINS.appendChild(pasteFragments(DESC_PINS));
