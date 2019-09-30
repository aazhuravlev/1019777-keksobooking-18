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

var spliceRandomItem = function (arr) {
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

  for (var i = 0; i < quantity; i++) {
    var price = '' + getRandomBetween(1, 100000) + '';
    var rooms = '' + getRandomBetween(1, 10) + '';
    var guests = '' + getRandomBetween(1, 10) + '';
    var checkin = getRandomArrItem(TIME);
    var checkout = getRandomArrItem(TIME);
    var features = getRandomArrItem(FEATURES);
    var locationX = '' + getRandomBetween(0, 1200) + '';
    var locationY = '' + getRandomBetween(130, 630) + '';
    pinsDesc.push({
      author: {
        avatar: spliceRandomItem(avatars),
      },
      offer: {
        title: spliceRandomItem(titles),
        adress: '' + locationX + ', ' + locationY + '',
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

var prepareCard = function (item) {
  var cardElement = SIMILAR_CARDS_TEMPLATE.cloneNode(true);

  var values = {
    title: item.offer.title,
    adress: item.offer.adress,
    price: item.offer.price + '₽/ночь',
    type: TYPES[item.offer.type],
    capacity: item.offer.rooms + ' комнат' + getRoomsLetter(Number(item.offer.rooms)) + ' для ' + item.offer.guests + ' гост' + getGuestsLetter(Number(item.offer.guests)),
    time: 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout,
    features: item.offer.features,
    description: item.offer.description,
    photos: getPhotos(PHOTOS),
    avatar: item.author.avatar
  };

  CONTENT_KEYS.forEach(function (key) {
    var keyItem = CONTENT[key];
    cardElement.querySelector('.popup__' + keyItem.selector)[keyItem.target] = values[key];
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
  fragment.appendChild(prepareCard(arr[0]));
  return fragment;
};

var main = function (quantity) {
  var DESC_PINS = getPins(quantity);
  PINS.appendChild(renderPins(DESC_PINS));
  MAP.insertBefore(renderCards(DESC_PINS), FILTERS);
  MAP.classList.remove('map--faded');
  return quantity;
};

main(PINS_COUNT);
