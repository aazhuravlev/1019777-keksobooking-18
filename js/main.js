'use strict';

var PINS_COUNT = 8;
var HOTEL_PHOTOS_COUNT = 3;
var TYPES = {palace: 'Дворец', flat: 'Квартира', house: 'Дом', bungalo: 'Бунгало'};
var TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var MIN_PRICE = 1;
var MAX_PRICE = 100000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 10;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;
var MIN_LOCATION_X = 0;
var MAX_LOCATION_X = 1200;
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;

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
    target: 'innerHTML'
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
var SIMILAR_PINS_TEMPLATE = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var SIMILAR_CARDS_TEMPLATE = document.querySelector('#card')
.content
.querySelector('.map__card');

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

var getRandomBetween = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomIndex = function (arr) {
  return getRandomBetween(0, arr.length);
};

var spliceRandomItem = function (arr) {
  return arr.splice(getRandomIndex(arr.length), 1);
};

var getRandomArrItem = function (arr) {
  return arr[getRandomIndex(arr)];
};

var getRandomArrRange = function (arr) {
  return arr.slice(0, getRandomBetween(0, arr.length));
};

var getPins = function (quantity) {
  var pinsDesc = [];
  var avatars = AVATARS.slice(0);
  var titles = TITLES.slice(0);
  var TYPE_KEYS = getRandomArrItem(Object.keys(TYPES));
  var descriptions = DESCRIPTIONS.slice(0);


  for (var i = 0; i < quantity; i++) {
    var price = getRandomBetween(MIN_PRICE, MAX_PRICE);
    var rooms = getRandomBetween(MIN_ROOMS, MAX_ROOMS);
    var guests = getRandomBetween(MIN_GUESTS, MAX_GUESTS);
    var checkin = getRandomArrItem(TIME);
    var checkout = getRandomArrItem(TIME);
    var features = getRandomArrRange(FEATURES);
    var locationX = getRandomBetween(MIN_LOCATION_X, MAX_LOCATION_X);
    var locationY = getRandomBetween(MIN_LOCATION_Y, MAX_LOCATION_Y);
    pinsDesc.push({
      author: {
        avatar: spliceRandomItem(avatars),
      },
      offer: {
        title: spliceRandomItem(titles),
        adress: locationX + ', ' + locationY,
        price: price,
        type: TYPE_KEYS,
        rooms: rooms,
        guests: guests,
        checkin: checkin,
        checkout: checkout,
        features: features,
        description: spliceRandomItem(descriptions),
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

var DESC_PINS = getPins(PINS_COUNT);

var getLocation = function (number) {
  return 'left: ' + number.location.x + ';' + ' top: ' + number.location.y + ';';
};

var preparePin = function (item) {
  var pinElement = SIMILAR_PINS_TEMPLATE.cloneNode(true);
  var pinImage = pinElement.querySelector('img');

  pinElement.setAttribute('style', getLocation(item));
  pinImage.src = item.author.avatar;
  pinImage.alt = item.offer.title;
  return pinElement;
};

var prepareFeatures = function (item) {
  return '<li class="popup__feature popup__feature--' + item + '"></li>';
};

var getFeatures = function (arr) {
  return arr.map(prepareFeatures).join('');
};

var preparePhotos = function (item) {
  return '<img src="' + item + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
};

var getPhotos = function (arr) {
  return arr.map(preparePhotos).join('');
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

var getCardValues = function (cardData) {
  return {
    title: cardData.offer.title,
    adress: cardData.offer.adress,
    price: cardData.offer.price + '₽/ночь',
    type: TYPES[cardData.offer.type],
    capacity: cardData.offer.rooms + ' комнат' + getRoomsLetter(Number(cardData.offer.rooms)) + ' для ' + cardData.offer.guests + ' гост' + getGuestsLetter(Number(cardData.offer.guests)),
    time: 'Заезд после ' + cardData.offer.checkin + ', выезд до ' + cardData.offer.checkout,
    features: getFeatures(cardData.offer.features),
    description: cardData.offer.description,
    photos: getPhotos(PHOTOS),
    avatar: cardData.author.avatar
  };
};

var prepareCard = function (item) {
  var cardElement = SIMILAR_CARDS_TEMPLATE.cloneNode(true);
  var keys = getCardValues(item);

  CONTENT_KEYS.forEach(function (key) {
    var keyItem = CONTENT[key];
    if (!keys[key]) {
      window['console']['error']('в values отсутствует ключ');
    } else {
      cardElement.querySelector('.popup__' + keyItem.selector)[keyItem.target] = keys[key];
    }
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

var main = function (quantity) {
  PINS.appendChild(renderPins(DESC_PINS));
  MAP.insertBefore(prepareCard(DESC_PINS[0]), FILTERS);
  MAP.classList.remove('map--faded');
  return quantity;
};

main(PINS_COUNT);
