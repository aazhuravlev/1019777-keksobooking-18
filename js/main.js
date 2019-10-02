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
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_TRIANGLE_HEIGHT = 22;
var MAIN_PIN_HEIGHT = 62;
var MAIN_PIN_FULL_HEIGHT = MAIN_PIN_HEIGHT + MAIN_PIN_TRIANGLE_HEIGHT;

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
var MAIN_PIN = document.querySelector('.map__pin--main');
var FORM = document.querySelector('.ad-form');
var INPUT_ADDRESS = document.querySelector('#address')
var TYPE_SELECT = document.querySelector('#type');
var TYPE_SELECT_OPTION = TYPE_SELECT.querySelectorAll('option');
var PRICE_PER_NIGHT = document.querySelector('#price');
var FORM_FIELDSETS = FORM.querySelectorAll('fieldset');
var FILTERS = document.querySelector('.map__filters-container');
var SIMILAR_PINS_TEMPLATE = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var SIMILAR_CARDS_TEMPLATE = document.querySelector('#card')
.content
.querySelector('.map__card');

var calcPinX = parseInt(MAIN_PIN.style.left, 10) + MAIN_PIN_WIDTH / 2;
var calcPinY = parseInt(MAIN_PIN.style.top, 10) + MAIN_PIN_HEIGHT / 2;
var calcActivePinY = parseInt(MAIN_PIN.style.top, 10) + MAIN_PIN_FULL_HEIGHT;

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

var getCardValues = function (cardData) {
  var roomDeclination = pluralize(cardData.offer.rooms, [' комната', ' комнаты', ' комнат']);
  var guestDeclination = pluralize(cardData.offer.guests, [' гостя', ' гостей', ' гостей']);
  return {
    title: cardData.offer.title,
    adress: cardData.offer.adress,
    price: cardData.offer.price + '₽/ночь',
    type: TYPES[cardData.offer.type],
    capacity: cardData.offer.rooms + roomDeclination + ' для ' + cardData.offer.guests + guestDeclination,
    time: 'Заезд после ' + cardData.offer.checkin + ', выезд до ' + cardData.offer.checkout,
    features: getFeatures(cardData.offer.features),
    description: cardData.offer.description,
    photos: getPhotos(PHOTOS),
    avatar: cardData.author.avatar
  };
};

var prepareCard = function (item) {
  var cardElement = SIMILAR_CARDS_TEMPLATE.cloneNode(true);
  var values = getCardValues(item);

  CONTENT_KEYS.forEach(function (key) {
    var keyItem = CONTENT[key];
    if (!values[key]) {
      window['console']['error']('в values отсутствует ключ ' + key);
    } else {
      cardElement.querySelector('.popup__' + keyItem.selector)[keyItem.target] = values[key];
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

var formFieldsetsDisabled = function (selector) {
  selector.forEach(function (item) {
    item.disabled = true;
  });
};

var formFieldsetsEnabled = function (selector) {
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

var openMap = function () {
  MAP.classList.remove('map--faded');
  FORM.classList.remove('ad-form--disabled');
  formFieldsetsEnabled(FORM_FIELDSETS);
  PINS.appendChild(renderPins(getPins(PINS_COUNT)));
  MAP.insertBefore(prepareCard(DESC_PINS[0]), FILTERS);
  MAIN_PIN.removeEventListener('mousedown', openMap);
  INPUT_ADDRESS.value = calcPinX + ', ' + calcActivePinY;
};

var changeTypeHousing = function () {
  var TYPE_SELECT_OPTIONS = {
    bungalo: {
      min: '0'
    },
    flat: {
      min: '1000'
    },
    house: {
      min: '5000'
    },
    palace: {
      min: '10000'
    }
  };

  TYPE_SELECT.addEventListener('change', function () {
    PRICE_PER_NIGHT.placeholder = TYPE_SELECT_OPTIONS[TYPE_SELECT.value].min;
    PRICE_PER_NIGHT.min = TYPE_SELECT_OPTIONS[TYPE_SELECT.value].min;
  });
};

var main = function () {
  formFieldsetsDisabled(FORM_FIELDSETS);
  changeTypeHousing();
  INPUT_ADDRESS.value = calcPinX + ', ' + calcPinY;
  MAIN_PIN.addEventListener('keydown', mapEnterPressHendler);
  MAIN_PIN.addEventListener('mousedown', openMap);
};

main();
