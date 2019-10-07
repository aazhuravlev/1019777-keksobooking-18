'use strict';

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
var MIN_LOCATION_X = 0;
var MAX_LOCATION_X = 1200;
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_TRIANGLE_HEIGHT = 22;
var MAIN_PIN_HEIGHT = 62;
var MAIN_PIN_FULL_HEIGHT = MAIN_PIN_HEIGHT + MAIN_PIN_TRIANGLE_HEIGHT;
var CAPACITY_VALUES = {
  '1': [2],
  '2': [1, 2],
  '3': [0, 1, 2],
  '100': [3]
};
var TYPE_SELECT_OPTIONS = {
  bungalo: '0',
  flat: '1000',
  house: '5000',
  palace: '10000'
};

var TEXT_CONTENT = 'textContent';
var INNER_HTML = 'innerHTML';
var SRC = 'src';
var CONTENT = {
  title: ['title', TEXT_CONTENT],
  adress: ['text--address', TEXT_CONTENT],
  price: ['text--price', TEXT_CONTENT],
  type: ['type', TEXT_CONTENT],
  capacity: ['text--capacity', TEXT_CONTENT],
  time: ['text--time', TEXT_CONTENT],
  features: ['features', INNER_HTML],
  description: ['description', TEXT_CONTENT],
  photos: ['photos', INNER_HTML],
  avatar: ['avatar', SRC]
};

var CONTENT_KEYS = Object.keys(CONTENT);

var MAP = document.querySelector('.map');
var PINS = document.querySelector('.map__pins');
var MAIN_PIN = document.querySelector('.map__pin--main');
var FORM = document.querySelector('.ad-form');
var FORM_RESET = document.querySelector('.ad-form__reset');
var FORM_FIELDSETS = FORM.querySelectorAll('fieldset');
var INPUT_ADDRESS = document.querySelector('#address');
var TYPE_SELECT = document.querySelector('#type');
var ROOM_SELECT = document.querySelector('#room_number');
var CAPACITY_SELECT = document.querySelector('#capacity');
var TIMEIN_SELECT = document.querySelector('#timein');
var TIMEOUT_SELECT = document.querySelector('#timeout');
var CAPACITY_OPTIONS = CAPACITY_SELECT.querySelectorAll('option');
var PRICE_PER_NIGHT = document.querySelector('#price');
var FILTERS = document.querySelector('.map__filters-container');
var SIMILAR_PINS_TEMPLATE = document.querySelector('#pin').content;
var MAP_PIN = SIMILAR_PINS_TEMPLATE.querySelector('.map__pin');
var SIMILAR_CARDS_TEMPLATE = document.querySelector('#card').content;
var MAP_CARD = SIMILAR_CARDS_TEMPLATE.querySelector('.map__card');
var calcPinX = parseInt(MAIN_PIN.style.left, 10) + MAIN_PIN_WIDTH / 2;
var calcPinY = parseInt(MAIN_PIN.style.top, 10) + MAIN_PIN_HEIGHT / 2;
var calcActivePinY = parseInt(MAIN_PIN.style.top, 10) + MAIN_PIN_FULL_HEIGHT;

var calcMainPinCoordinates = function () {
  return calcPinX + ', ' + calcPinY;
};

var calcActiveMainPinCoordinates = function () {
  return calcPinX + ', ' + calcActivePinY;
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
var DESCRIPTIONS = createList(PINS_COUNT, 'description', '');
var PHOTOS = createList(HOTEL_PHOTOS_COUNT, 'http://o0.github.io/assets/images/tokyo/hotel', '.jpg');

var getRandomBetween = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomIndex = function (max) {
  return getRandomBetween(0, max - 1);
};

var spliceRandomItem = function (arr) {
  return arr.splice(getRandomIndex(arr.length - 1), 1);
};

var getRandomItem = function (arr) {
  return arr[getRandomIndex(arr.length)];
};

var getRandomSlice = function (arr) {
  return arr.slice(0, 2 + getRandomIndex(arr.length - 2));
};

var pluralize = function (number, arr) {
  number %= 100;
  if (number >= 5 && number <= 20) {
    return arr[2];
  }
  number %= 10;
  if (number === 1) {
    return arr[0];
  }
  if (number >= 2 && number <= 4) {
    return arr[1];
  }
  return arr[2];
};

var getPins = function (quantity) {
  var pinsDesc = [];
  var avatars = AVATARS.slice(0);
  var titles = TITLES.slice(0);
  var TYPE_KEYS = getRandomItem(Object.keys(TYPES));
  var descriptions = DESCRIPTIONS.slice(0);


  for (var i = 0; i < quantity; i++) {
    var locationX = getRandomBetween(MIN_LOCATION_X, MAX_LOCATION_X);
    var locationY = getRandomBetween(MIN_LOCATION_Y, MAX_LOCATION_Y);
    pinsDesc.push({
      author: {
        avatar: spliceRandomItem(avatars),
      },
      offer: {
        title: spliceRandomItem(titles),
        adress: locationX + ', ' + locationY,
        price: getRandomBetween(MIN_PRICE, MAX_PRICE),
        type: TYPE_KEYS,
        rooms: getRandomBetween(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomBetween(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomItem(TIME),
        checkout: getRandomItem(TIME),
        features: getRandomSlice(FEATURES),
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

var preparePin = function (item, i) {
  var pinElement = MAP_PIN.cloneNode(true);
  var pinImage = pinElement.querySelector('img');

  pinElement.setAttribute('style', getLocation(item));
  pinElement.setAttribute('data-id', i);
  pinImage.src = item.author.avatar;
  pinImage.alt = item.offer.title;
  return pinElement;
};

var getFeature = function (item) {
  return '<li class="popup__feature popup__feature--' + item + '"></li>';
};

var getFeatures = function (arr) {
  return arr.map(getFeature).join('');
};

var getPhoto = function (item) {
  return '<img src="' + item + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
};

var getPhotos = function (arr) {
  return arr.map(getPhoto).join('');
};

var getCapacity = function (number) {
  var roomDeclination = pluralize(number.offer.rooms, [' комната', ' комнаты', ' комнат']);
  var guestDeclination = pluralize(number.offer.guests, [' гостя', ' гостей', ' гостей']);
  return number.offer.rooms + roomDeclination + ' для ' + number.offer.guests + guestDeclination;
};

var getCardValues = function (cardData) {
  return {
    title: cardData.offer.title,
    adress: cardData.offer.adress,
    price: cardData.offer.price + '₽/ночь',
    type: TYPES[cardData.offer.type],
    capacity: getCapacity(cardData),
    time: 'Заезд после ' + cardData.offer.checkin + ', выезд до ' + cardData.offer.checkout,
    features: getFeatures(cardData.offer.features),
    description: cardData.offer.description,
    photos: getPhotos(PHOTOS),
    avatar: cardData.author.avatar
  };
};

var prepareCard = function (item) {
  var cardElement = MAP_CARD.cloneNode(true);
  var values = getCardValues(item);

  CONTENT_KEYS.forEach(function (key) {
    var keyItem = CONTENT[key];
    if (!values[key]) {
      window['console']['error']('в values отсутствует ключ ' + key);
    } else {
      cardElement.querySelector('.popup__' + keyItem[0])[keyItem[1]] = values[key];
    }
  });
  return cardElement;
};

var renderPins = function (arr) {
  var fragment = document.createDocumentFragment();
  arr.forEach(function (item, i) {
    fragment.appendChild(preparePin(item, i));
  });
  return fragment;
};

var setDisabledFormFieldsets = function (selector) {
  FORM.classList.add('ad-form--disabled');
  selector.forEach(function (item) {
    item.disabled = true;
  });
};

var setEnabledFormFieldsets = function (selector) {
  FORM.classList.remove('ad-form--disabled');
  selector.forEach(function (item) {
    item.disabled = false;
  });
};

var mapEnterPressHendler = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openMap();
    MAIN_PIN.removeEventListener('keydown', mapEnterPressHendler);
  }
};

var removeMapCard = function () {
  var mapCard = MAP.querySelector('.map__card');
  if (mapCard) {
    mapCard.remove();
  }
};

var removeMapCardKeydownHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removeMapCard();
  }
};

var pinClickHandler = function (evt) {
  var idx = evt.target.getAttribute('data-id') || evt.target.parentNode.getAttribute('data-id');
  if (idx) {
    removeMapCard();
    MAP.insertBefore(prepareCard(DESC_PINS[idx]), FILTERS);
    MAP.querySelector('.popup__close').addEventListener('click', removeMapCard);
  }
};

var openMap = function () {
  MAP.classList.remove('map--faded');
  setEnabledFormFieldsets(FORM_FIELDSETS);
  PINS.appendChild(renderPins(DESC_PINS));
  INPUT_ADDRESS.value = calcActiveMainPinCoordinates();
  MAIN_PIN.removeEventListener('mousedown', openMap);
};

var removeSelectors = function (selectors) {
  selectors.forEach(function (item) {
    item.remove();
  });
};

var formReset = function () {
  MAP.classList.add('map--faded');
  setDisabledFormFieldsets(FORM_FIELDSETS);
  INPUT_ADDRESS.value = calcMainPinCoordinates();
  removeSelectors(PINS.querySelectorAll('[type]'));
  removeMapCard();
};

var typeSelectChangeHandler = function () {
  PRICE_PER_NIGHT.placeholder = TYPE_SELECT_OPTIONS[TYPE_SELECT.value];
  PRICE_PER_NIGHT.min = TYPE_SELECT_OPTIONS[TYPE_SELECT.value].min;
};

var changeRoomsHandler = function () {
  CAPACITY_OPTIONS.forEach(function (item) {
    item.disabled = true;
  });
  CAPACITY_VALUES[ROOM_SELECT.value].forEach(function (item) {
    CAPACITY_OPTIONS[item].disabled = false;
  });
  CAPACITY_OPTIONS[CAPACITY_VALUES[ROOM_SELECT.value][0]].selected = true;
};

var timeInSelectHandler = function () {
  TIMEOUT_SELECT[TIME.indexOf(TIMEIN_SELECT.value)].selected = true;
};

var timeOutSelectHandler = function () {
  TIMEIN_SELECT[TIME.indexOf(TIMEOUT_SELECT.value)].selected = true;
};

var main = function () {
  setDisabledFormFieldsets(FORM_FIELDSETS);
  PINS.addEventListener('click', pinClickHandler);
  MAP.addEventListener('keydown', removeMapCardKeydownHandler);
  TYPE_SELECT.addEventListener('change', typeSelectChangeHandler);
  ROOM_SELECT.addEventListener('change', changeRoomsHandler);
  TIMEIN_SELECT.addEventListener('change', timeInSelectHandler);
  TIMEOUT_SELECT.addEventListener('change', timeOutSelectHandler);
  INPUT_ADDRESS.value = calcMainPinCoordinates();
  MAIN_PIN.addEventListener('keydown', mapEnterPressHendler);
  MAIN_PIN.addEventListener('mousedown', openMap);
  FORM_RESET.addEventListener('click', formReset);
};

var DESC_PINS = getPins(PINS_COUNT);
main();
