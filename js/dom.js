'use strict';

(function () {
  var INPUT_SHADOW_COLOR = '0 0 2px 2px #ff0000';

  var MAIN_PIN = {
    width: 62,
    height: 22,
    triangleHeight: 22,
    startX: 570,
    startY: 375
  };
  MAIN_PIN.fullHeight = MAIN_PIN.height + MAIN_PIN.triangleHeight;
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
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

  window.NODES = findNodes(SELECTORS_DATA);
  var calcPinX = window.NODES.mainPin.offsetLeft + MAIN_PIN.width / 2;
  var calcPinY = window.NODES.mainPin.offsetTop + MAIN_PIN.height / 2;
  var calcActivePinY = window.NODES.mainPin.offsetTop + MAIN_PIN.fullHeight;

  window.calcMainPinCoordinates = function () {
    return calcPinX + ', ' + calcPinY;
  };

  var calcActiveMainPinCoordinates = function () {
    return calcPinX + ', ' + calcActivePinY;
  };

  var preparePin = function (item, i) {
    var pinElement = window.NODES.mapPin.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.setAttribute('style', window.getLocation(item));
    pinElement.setAttribute('data-id', i);
    pinImage.src = item.author.avatar;
    pinImage.alt = item.offer.title;
    return pinElement;
  };

  var prepareCard = function (item) {
    var cardElement = window.NODES.mapCard.cloneNode(true);
    var values = window.getCardValues(item);

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

  window.setStatusFormFieldsets = function (selector, action) {
    window.NODES.form.classList[action]('ad-form--disabled');
    selector.forEach(function (item) {
      item.disabled = action !== 'remove';
    });
  };

  window.mapEnterPressHendler = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openMap();
    }
  };

  var removeMapCard = function () {
    var mapCard = window.NODES.map.querySelector('.map__card');
    if (mapCard) {
      mapCard.remove();
    }
  };

  window.removeMapCardKeydownHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeMapCard();
    }
  };

  window.pinClickHandler = function (evt) {
    var idx = evt.target.getAttribute('data-id') || evt.target.parentNode.getAttribute('data-id');
    if (idx) {
      removeMapCard();
      window.NODES.map.insertBefore(prepareCard(window.DESC_PINS[idx]), window.NODES.filters);
      window.NODES.map.querySelector('.popup__close').addEventListener('click', removeMapCard);
    }
  };

  var openMap = function () {
    window.NODES.map.classList.remove('map--faded');
    window.setStatusFormFieldsets(window.NODES.formFieldsets, 'remove');
    window.NODES.pins.appendChild(renderPins(window.DESC_PINS));
    window.NODES.inputAddress.value = calcActiveMainPinCoordinates();
  };

  var removeSelectors = function (nodes) {
    nodes.forEach(function (item) {
      item.remove();
    });
  };

  window.formReset = function () {
    window.NODES.map.classList.add('map--faded');
    window.setStatusFormFieldsets(window.NODES.formFieldsets, 'add');
    window.NODES.inputAddress.value = window.calcMainPinCoordinates();
    removeSelectors(window.NODES.pins.querySelectorAll('[type]'));
    removeMapCard();
    window.NODES.mainPin.style.top = MAIN_PIN.startY + 'px';
    window.NODES.mainPin.style.left = MAIN_PIN.startX + 'px';
  };

  var addShadow = function (node) {
    node.style.boxShadow = INPUT_SHADOW_COLOR;
  };

  var removeShadow = function (node) {
    node.style.boxShadow = '';
  };

  window.adTitleChangeHandler = function () {
    if (window.NODES.adTitle.validity.tooShort || window.NODES.adTitle.validity.tooLong) {
      window.NODES.adTitle.reportValidity();
      addShadow(window.NODES.adTitle);
    } else {
      removeShadow(window.NODES.adTitle);
    }
  };

  window.typeSelectChangeHandler = function () {
    window.NODES.pricePerNight.placeholder = TYPE_SELECT_OPTIONS[window.NODES.typeSelect.value];
    window.NODES.pricePerNight.min = TYPE_SELECT_OPTIONS[window.NODES.typeSelect.value];
    if (window.NODES.pricePerNight.min > window.NODES.pricePerNight.value) {
      window.NODES.pricePerNight.reportValidity();
    }
  };

  window.pricePerNightHandler = function () {
    if (window.NODES.pricePerNight.min > window.NODES.pricePerNight.value) {
      window.NODES.pricePerNight.reportValidity();
      addShadow(window.NODES.pricePerNight);
    } else {
      removeShadow(window.NODES.pricePerNight);
    }
  };

  window.changeRoomsHandler = function () {
    window.NODES.capacityOptions.forEach(function (item) {
      item.disabled = true;
    });
    CAPACITY_VALUES[window.NODES.roomSelect.value].forEach(function (item) {
      window.NODES.capacityOptions[item].disabled = false;
    });
    window.NODES.capacityOptions[CAPACITY_VALUES[window.NODES.roomSelect.value][0]].selected = true;
  };

  window.timeInSelectHandler = function () {
    window.NODES.timeOutSelect[window.TIME.indexOf(window.NODES.timeInSelect.value)].selected = true;
  };

  window.timeOutSelectHandler = function () {
    window.NODES.timeInSelect[window.TIME.indexOf(window.NODES.timeOutSelect.value)].selected = true;
  };

  window.dragHandler = function (evt) {
    openMap();
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var actualX = window.NODES.mainPin.offsetLeft - shift.x;
      var actualY = window.NODES.mainPin.offsetTop - shift.y;

      if (actualX <= window.LOCATION.minX) {
        actualX = window.LOCATION.minX;
      } else if (actualX >= window.LOCATION.maxX) {
        actualX = window.LOCATION.maxX;
      }
      if (actualY <= window.LOCATION.minY) {
        actualY = window.LOCATION.minY;
      } else if (actualY >= window.LOCATION.maxY) {
        actualY = window.LOCATION.maxY;
      }

      var triangleActualX = actualX - shift.x + MAIN_PIN.width / 2;
      var triangleActualY = actualY + MAIN_PIN.fullHeight;

      window.NODES.mainPin.style.top = actualY + 'px';
      window.NODES.mainPin.style.left = actualX + 'px';
      window.NODES.inputAddress.value = triangleActualX + ', ' + triangleActualY;
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
})();
