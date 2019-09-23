'use strict';

var PINS_COUNT = 8;
var HOTEL_PHOTOS_COUNT = 3;
var TYPES = {palace: 'Дворец', flat: 'Квартира', house: 'Дом', bungalo: 'Бунгало'};
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

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

var getPins = function (quantity) {
  var pinsDesc = [];
  var avatars = AVATARS.slice(0);
  var titles = TITLES.slice(0);
  var descriptions = DESCRIPTIONS.slice(0);
  var checkin = CHECKIN[getRandomIntInclusive(0, CHECKIN.length - 1)];
  var checkout = CHECKOUT[getRandomIntInclusive(0, CHECKOUT.length - 1)];
  var features = FEATURES[getRandomIntInclusive(0, FEATURES.length - 1)];

  for (var i = 0; i < quantity; i++) {
    var types = Object.keys(TYPES)[getRandomIntInclusive(0, Object.keys(TYPES).length - 1)];
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
        type: types,
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

var prepareCard = function (arr) {
  var cardElement = SIMILAR_CARDS_TEMPLATE.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = arr.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = arr.offer.adress;
  cardElement.querySelector('.popup__text--price').textContent = arr.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = TYPES[arr.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = arr.offer.rooms + ' комнаты для ' + arr.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + arr.offer.checkin + ', выезд до ' + arr.offer.checkout;
  cardElement.querySelector('.popup__features').textContent = arr.offer.features;
  cardElement.querySelector('.popup__description').textContent = arr.offer.description;
  cardElement.querySelector('.popup__photos').innerHTML = '<img src="' + PHOTOS[0] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья"><img src="' + PHOTOS[1] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья"><img src="' + PHOTOS[2] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
  cardElement.querySelector('.popup__avatar').src = arr.author.avatar;
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
