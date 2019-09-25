'use strict';

var PINS_COUNT = 8;
var HOTEL_PHOTOS_COUNT = 3;
var TYPES = {palace: 'Дворец', flat: 'Квартира', house: 'Дом', bungalo: 'Бунгало'};
var TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TEXT_CONTENT = 'textContent';
var CONTENT = {
  title: {
    selector: 'title',
    target: TEXT_CONTENT
  },
  adress: {
    selector: 'text--address',
    target: TEXT_CONTENT
  },
  price: {
    selector: 'text--price',
    target: TEXT_CONTENT
  },
  type: {
    selector: 'type',
    target: TEXT_CONTENT
  },
  capacity: {
    selector: 'text--capacity',
    target: TEXT_CONTENT
  },
  time: {
    selector: 'text--time',
    target: TEXT_CONTENT
  },
  features: {
    selector: 'features',
    target: TEXT_CONTENT
  },
  description: {
    selector: 'description',
    target: TEXT_CONTENT
  },
  photos: {
    selector: 'photos',
    target: 'innerHTML'
  },
  avatar: {
    selector: 'avatar',
    target: 'src'
  }
};
var CONTENT_KEYS = Object.keys(CONTENT);

var MAP = document.querySelector('.map');
var PINS = document.querySelector('.map__pins');
var FILTERS = document.querySelector('.map__filters-container');

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
var PHOTOS = createList(HOTEL_PHOTOS_COUNT, 'http://o0.github.io/assets/images/tokyo/hotel', '.jpg');

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

var getRandomArrItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getPins = function (quantity) {
  var pinsDesc = [];
  var avatars = AVATARS.slice(0);
  var titles = TITLES.slice(0);
  var TYPE_KEYS = getRandomArrItem(Object.keys(TYPES));
  var descriptions = DESCRIPTIONS.slice(0);
  var checkin = getRandomArrItem(TIME);
  var checkout = getRandomArrItem(TIME);
  var features = getRandomArrItem(FEATURES);

  for (var i = 0; i < quantity; i++) {
    var price = '' + getRandomIntInclusive(1, 100000) + '';
    var rooms = '' + getRandomIntInclusive(1, 10) + '';
    var guests = '' + getRandomIntInclusive(1, 10) + '';
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
        type: TYPE_KEYS,
        rooms: rooms,
        guests: guests,
        checkin: checkin,
        checkout: checkout,
        features: features,
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

var getPhotos = function (arr) {
  var photos = [];
  arr.forEach(function (item) {
    photos += '<img src="' + item + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
  });
  return photos;
};

var getRoomsLetter = function (number) {
  var letter = '';
  if (number === 1) {
    letter = 'a';
  } else if (number >= 2 && number <= 4) {
    letter = 'ы';
  }
  return letter;
};

var getGuestsLetter = function (number) {
  return number === 1 ? 'я' : 'ей';
};

var prepareCard = function (arr) {
  var cardElement = SIMILAR_CARDS_TEMPLATE.cloneNode(true);

  var values = {
    title: arr.offer.title,
    adress: arr.offer.adress,
    price: arr.offer.price + '₽/ночь',
    type: TYPES[arr.offer.type],
    capacity: arr.offer.rooms + ' комнат' + getRoomsLetter(Number(arr.offer.rooms)) + ' для ' + arr.offer.guests + ' гост' + getGuestsLetter(Number(arr.offer.guests)),
    time: 'Заезд после ' + arr.offer.checkin + ', выезд до ' + arr.offer.checkout,
    features: arr.offer.features,
    description: arr.offer.description,
    photos: getPhotos(PHOTOS),
    avatar: arr.author.avatar
  };

  CONTENT_KEYS.forEach(function (key) {
    var item = CONTENT[key];
    cardElement.querySelector('.popup__' + item.selector)[item.target] = values[key];
  });
  return cardElement;
};

var renderPins = function (arr) {
  var fragment = document.createDocumentFragment();
  arr.forEach(function (item) {
    fragment.appendChild(preparePin(item));
  });
  return fragment;
};

var renderCards = function (arr) {
  var fragment = document.createDocumentFragment();
  arr.forEach(function (item) {
    fragment.appendChild(prepareCard(item));
  });
  return fragment;
};

var DESC_PINS = getPins(PINS_COUNT);
PINS.appendChild(renderPins(DESC_PINS));
MAP.insertBefore(renderCards(DESC_PINS), FILTERS);
MAP.classList.remove('map--faded');
