'use strict';

var PINS_COUNT = 8;
var AVATARS = ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'];
var TITLES = ['title1', 'title2', 'title3', 'title4', 'title5', 'title6', 'title7', 'title8'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
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
  var price = '' + getRandomIntInclusive(0, 100000) + '';
  var types = TYPES.slice(0);
  var rooms = '' + getRandomIntInclusive(0, 10) + '';
  var guests = '' + getRandomIntInclusive(0, 10) + '';
  var checkin = CHECKIN.slice(0);
  var checkout = CHECKOUT.slice(0);
  var features = FEATURES.slice(0);
  var descriptions = DESCRIPTIONS.slice(0);
  var locationX = '' + getRandomIntInclusive(0, 1200) + '';
  var locationY = '' + getRandomIntInclusive(130, 630) + '';

  for (var i = 0; i < quantity; i++) {
    pinsDesc.push({
      author: {
        avatar: getRandomItem(avatars),
      },
      offer: {
        title: getRandomItem(titles),
        adress: '' + location.x + ', ' + location.y + '',
        price: price,
        type: getRandomItem(types),
        rooms: rooms,
        guests: guests,
        checkin: getRandomItem(checkin),
        checkout: getRandomItem(checkout),
        features: getRandomItem(features),
        description: getRandomItem(descriptions),
        photos: PHOTOS
      },
      location: {
        x: locationX,
        y: locationY
      }
    });
  }
  return pinsDesc;
};

var renderPin = function (arr) {
  var pinElement = SIMILAR_PINS_TEMPLATE.cloneNode(true);

  for (var i = 0; i < arr.length; i++) {
    pinElement.style = 'left: ' + arr[i].location.x + 'top ' + arr[i].location.y;
    pinElement.querySelector('img').setAttribute('src', arr[i].author.avatar);
    pinElement.querySelector('img').setAttribute('alt', arr[i].offer.title);
  }
  return pinElement;
};

var getFragment = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderPin(arr[i]));
  }
  return fragment;
};

var DESC_PINS = getPins(PINS_COUNT);
PINS.appendChild(getFragment(DESC_PINS));
