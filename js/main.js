'use strict';

var PINS_COUNT = 8;
var HOTEL_PHOTOS_COUNT = 3;
var TYPES = {palace: 'Дворец', flat: 'Квартира', house: 'Дом', bungalo: 'Бунгало'};
var TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var INPUT_SHADOW_COLOR = '0 0 2px 2px #ff0000';
var MIN_PRICE = 1;
var MAX_PRICE = 50000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 3;
var MIN_GUESTS = 1;
var MAX_GUESTS = 3;
var LOCATION = {
  minX: 0,
  maxX: 1200,
  minY: 130,
  maxY: 630
};
var MAIN_PIN = {
  width: 62,
  height: 22,
  triangleHeight: 22
};
MAIN_PIN.fullHeight = MAIN_PIN.height + MAIN_PIN.triangleHeight;
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var ROOM_DECLINATION;
var ROOM_DECLINATION_VALUES = [' комната', ' комнаты', ' комнат'];
var GUEST_DECLINATION;
var GUEST_DECLINATION_VALUES = [' гостя', ' гостей', ' гостей'];
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

var SELECTORS_DATA = {
  map: '.map',
  pins: '.map__pins',
  mainPin: '.map__pin--main',
  form: '.ad-form',
  formReset: '.ad-form__reset',
  inputAddress: '#address',
  adTitle: '#title',
  typeSelect: '#type',
  roomSelect: '#room_number',
  capacitySelect: '#capacity',
  timeInSelect: '#timein',
  timeOutSelect: '#timeout',
  pricePerNight: '#price',
  filters: '.map__filters-container',
  similarPinsTemplate: '#pin',
  similarCardsTemplate: '#card',
};

var findNodes = function (obj) {
  var nodes = {};
  var keys = Object.keys(obj);
  keys.forEach(function (key) {
    nodes[key] = document.querySelector(obj[key]);
  });
  nodes.formFieldsets = nodes.form.querySelectorAll('fieldset');
  nodes.capacityOptions = nodes.capacitySelect.querySelectorAll('option');
  nodes.mapPin = nodes.similarPinsTemplate.content.querySelector('.map__pin');
  nodes.mapCard = nodes.similarCardsTemplate.content.querySelector('.map__card');
  return nodes;
};

var NODES = findNodes(SELECTORS_DATA);
var calcPinX = parseInt(NODES.mainPin.style.left, 10) + MAIN_PIN.width / 2;
var calcPinY = parseInt(NODES.mainPin.style.top, 10) + MAIN_PIN.height / 2;
var calcActivePinY = parseInt(NODES.mainPin.style.top, 10) + MAIN_PIN.fullHeight;

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
  var remainder = number % 100;
  if (remainder >= 5 && remainder <= 20) {
    return arr[2];
  }
  remainder = number % 10;
  if (remainder === 1) {
    return arr[0];
  }
  if (remainder >= 2 && remainder <= 4) {
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
    var locationX = getRandomBetween(LOCATION.minX, LOCATION.maxX);
    var locationY = getRandomBetween(LOCATION.minY, LOCATION.maxY);
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
  var pinElement = NODES.mapPin.cloneNode(true);
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
  var item = number.offer;
  ROOM_DECLINATION = pluralize(item.rooms, ROOM_DECLINATION_VALUES);
  GUEST_DECLINATION = pluralize(item.guests, GUEST_DECLINATION_VALUES);
  return item.rooms + ROOM_DECLINATION + ' для ' + item.guests + GUEST_DECLINATION;
};

var getCardValues = function (cardData) {
  var item = cardData.offer;
  return {
    title: item.title,
    adress: item.adress,
    price: item.price + '₽/ночь',
    type: TYPES[item.type],
    capacity: getCapacity(cardData),
    time: 'Заезд после ' + item.checkin + ', выезд до ' + item.checkout,
    features: getFeatures(item.features),
    description: item.description,
    photos: getPhotos(PHOTOS),
    avatar: cardData.author.avatar
  };
};

var prepareCard = function (item) {
  var cardElement = NODES.mapCard.cloneNode(true);
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

var setStatusFormFieldsets = function (selector, action) {
  NODES.form.classList[action]('ad-form--disabled');
  selector.forEach(function (item) {
    item.disabled = action !== 'remove';
  });
};

var mapEnterPressHendler = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openMap();
    NODES.mainPin.removeEventListener('keydown', mapEnterPressHendler);
  }
};

var removeMapCard = function () {
  var mapCard = NODES.map.querySelector('.map__card');
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
    NODES.map.insertBefore(prepareCard(DESC_PINS[idx]), NODES.filters);
    NODES.map.querySelector('.popup__close').addEventListener('click', removeMapCard);
  }
};

var openMap = function () {
  NODES.map.classList.remove('map--faded');
  setStatusFormFieldsets(NODES.formFieldsets, 'remove');
  NODES.pins.appendChild(renderPins(DESC_PINS));
  NODES.inputAddress.value = calcActiveMainPinCoordinates();
  NODES.mainPin.removeEventListener('mousedown', openMap);
};

var removeSelectors = function (nodes) {
  nodes.forEach(function (item) {
    item.remove();
  });
};

var formReset = function () {
  NODES.map.classList.add('map--faded');
  setStatusFormFieldsets(NODES.formFieldsets, 'add');
  NODES.inputAddress.value = calcMainPinCoordinates();
  removeSelectors(NODES.pins.querySelectorAll('[type]'));
  removeMapCard();
};

var addShadow = function (node) {
  node.style.boxShadow = INPUT_SHADOW_COLOR;
};

var removeShadow = function (node) {
  node.style.boxShadow = '';
};

var adTitleChangeHandler = function () {
  if (NODES.adTitle.validity.tooShort || NODES.adTitle.validity.tooLong) {
    NODES.adTitle.reportValidity();
    addShadow(NODES.adTitle);
  } else {
    removeShadow(NODES.adTitle);
  }
};

var typeSelectChangeHandler = function () {
  NODES.pricePerNight.placeholder = TYPE_SELECT_OPTIONS[NODES.typeSelect.value];
  NODES.pricePerNight.min = TYPE_SELECT_OPTIONS[NODES.typeSelect.value];
  if (NODES.pricePerNight.min > NODES.pricePerNight.value) {
    NODES.pricePerNight.reportValidity();
    addShadow(NODES.pricePerNight);
  } else {
    removeShadow(NODES.pricePerNight);
  }
};

var changeRoomsHandler = function () {
  NODES.capacityOptions.forEach(function (item) {
    item.disabled = true;
  });
  CAPACITY_VALUES[NODES.roomSelect.value].forEach(function (item) {
    NODES.capacityOptions[item].disabled = false;
  });
  NODES.capacityOptions[CAPACITY_VALUES[NODES.roomSelect.value][0]].selected = true;
};

var timeInSelectHandler = function () {
  NODES.timeOutSelect[TIME.indexOf(NODES.timeInSelect.value)].selected = true;
};

var timeOutSelectHandler = function () {
  NODES.timeInSelect[TIME.indexOf(NODES.timeOutSelect.value)].selected = true;
};

var main = function () {
  setStatusFormFieldsets(NODES.formFieldsets, 'add');
  NODES.pins.addEventListener('click', pinClickHandler);
  NODES.map.addEventListener('keydown', removeMapCardKeydownHandler);
  NODES.adTitle.addEventListener('change', adTitleChangeHandler);
  NODES.typeSelect.addEventListener('change', typeSelectChangeHandler);
  NODES.roomSelect.addEventListener('change', changeRoomsHandler);
  NODES.timeInSelect.addEventListener('change', timeInSelectHandler);
  NODES.timeOutSelect.addEventListener('change', timeOutSelectHandler);
  NODES.inputAddress.value = calcMainPinCoordinates();
  NODES.mainPin.addEventListener('keydown', mapEnterPressHendler);
  NODES.mainPin.addEventListener('mousedown', openMap);
  NODES.formReset.addEventListener('click', formReset);
};

var DESC_PINS = getPins(PINS_COUNT);
main();
