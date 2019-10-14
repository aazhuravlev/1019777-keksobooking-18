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
    filters: '.map__filters-container'
  };

  var findNodes = function (obj) {
    var nodes = {};
    var keys = Object.keys(obj);
    keys.forEach(function (key) {
      nodes[key] = document.querySelector(obj[key]);
    });
    nodes.formFieldsets = nodes.form.querySelectorAll('fieldset');
    nodes.capacityOptions = nodes.capacitySelect.querySelectorAll('option');
    return nodes;
  };

  var NODES = findNodes(SELECTORS_DATA);
  var calcPinX = NODES.mainPin.offsetLeft + MAIN_PIN.width / 2;
  var calcPinY = NODES.mainPin.offsetTop + MAIN_PIN.height / 2;
  var calcActivePinY = NODES.mainPin.offsetTop + MAIN_PIN.fullHeight;

  var calcMainPinCoordinates = function () {
    return calcPinX + ', ' + calcPinY;
  };

  var calcActiveMainPinCoordinates = function () {
    return calcPinX + ', ' + calcActivePinY;
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
      NODES.map.insertBefore(window.cards.prepareCard(window.data.descPins[idx]), NODES.filters);
      NODES.map.querySelector('.popup__close').addEventListener('click', removeMapCard);
    }
  };

  var openMap = function () {
    NODES.map.classList.remove('map--faded');
    setStatusFormFieldsets(NODES.formFieldsets, 'remove');
    NODES.pins.appendChild(window.pins.renderPins(window.data.descPins));
    NODES.inputAddress.value = calcActiveMainPinCoordinates();
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
    NODES.mainPin.style.top = MAIN_PIN.startY + 'px';
    NODES.mainPin.style.left = MAIN_PIN.startX + 'px';
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
    }
  };

  var pricePerNightHandler = function () {
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
    NODES.timeOutSelect[window.data.time.indexOf(NODES.timeInSelect.value)].selected = true;
  };

  var timeOutSelectHandler = function () {
    NODES.timeInSelect[window.data.time.indexOf(NODES.timeOutSelect.value)].selected = true;
  };

  var dragHandler = function (evt) {
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

      var actualX = NODES.mainPin.offsetLeft - shift.x;
      var actualY = NODES.mainPin.offsetTop - shift.y;

      if (actualX <= window.data.location.minX) {
        actualX = window.data.location.minX;
      } else if (actualX >= window.data.location.maxX) {
        actualX = window.data.location.maxX;
      }
      if (actualY <= window.data.location.minY) {
        actualY = window.data.location.minY;
      } else if (actualY >= window.data.location.maxY) {
        actualY = window.data.location.maxY;
      }

      var triangleActualX = actualX - shift.x + MAIN_PIN.width / 2;
      var triangleActualY = actualY + MAIN_PIN.fullHeight;

      NODES.mainPin.style.top = actualY + 'px';
      NODES.mainPin.style.left = actualX + 'px';
      NODES.inputAddress.value = triangleActualX + ', ' + triangleActualY;
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  window.dom = {
    nodes: NODES,
    calcMainPinCoordinates: calcMainPinCoordinates,
    setStatusFormFieldsets: setStatusFormFieldsets,
    mapEnterPressHendler: mapEnterPressHendler,
    removeMapCardKeydownHandler: removeMapCardKeydownHandler,
    pinClickHandler: pinClickHandler,
    formReset: formReset,
    adTitleChangeHandler: adTitleChangeHandler,
    typeSelectChangeHandler: typeSelectChangeHandler,
    pricePerNightHandler: pricePerNightHandler,
    changeRoomsHandler: changeRoomsHandler,
    timeInSelectHandler: timeInSelectHandler,
    timeOutSelectHandler: timeOutSelectHandler,
    dragHandler: dragHandler
  };
})();
