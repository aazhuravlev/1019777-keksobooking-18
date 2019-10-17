'use strict';

(function () {
  var TIME = ['12:00', '13:00', '14:00'];
  var INPUT_SHADOW_COLOR = '0 0 2px 2px #ff0000';
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
    form: '.ad-form',
    formReset: '.ad-form__reset',
    inputAddress: '#address',
    adTitle: '#title',
    typeSelect: '#type',
    roomSelect: '#room_number',
    capacitySelect: '#capacity',
    timeInSelect: '#timein',
    timeOutSelect: '#timeout',
    pricePerNight: '#price'
  };

  var NODES = window.util.findNodes(SELECTORS_DATA);
  NODES.formFieldsets = NODES.form.querySelectorAll('fieldset');
  NODES.capacityOptions = NODES.capacitySelect.querySelectorAll('option');

  var EVENTS_HANDLERS = {
    change: 'change',
    click: 'click'
  };

  var setStatusFormFieldsets = function (selector, action) {
    NODES.form.classList[action]('ad-form--disabled');
    selector.forEach(function (item) {
      item.disabled = action !== 'remove';
    });
  };

  var removeSelectors = function (nodes) {
    nodes.forEach(function (item) {
      item.remove();
    });
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
    NODES.timeOutSelect[TIME.indexOf(NODES.timeInSelect.value)].selected = true;
  };

  var timeOutSelectHandler = function () {
    NODES.timeInSelect[TIME.indexOf(NODES.timeOutSelect.value)].selected = true;
  };

  var formReset = function () {
    window.card.nodes.map.classList.add('map--faded');
    setStatusFormFieldsets(NODES.formFieldsets, 'add');
    NODES.inputAddress.value = window.pin.calcMainPinCoordinates();
    removeSelectors(window.pin.nodes.pins.querySelectorAll('[type]'));
    window.card.remove();
    window.pin.nodes.mainPin.style.top = window.pin.mainPin.startY + 'px';
    window.pin.nodes.mainPin.style.left = window.pin.mainPin.startX + 'px';
  };


  var HANDLERS_DATA = [
    [NODES.adTitle, EVENTS_HANDLERS.change, adTitleChangeHandler],
    [NODES.typeSelect, EVENTS_HANDLERS.change, typeSelectChangeHandler],
    [NODES.pricePerNight, EVENTS_HANDLERS.change, pricePerNightHandler],
    [NODES.roomSelect, EVENTS_HANDLERS.change, changeRoomsHandler],
    [NODES.timeInSelect, EVENTS_HANDLERS.change, timeInSelectHandler],
    [NODES.timeOutSelect, EVENTS_HANDLERS.change, timeOutSelectHandler],
    [NODES.formReset, EVENTS_HANDLERS.click, formReset]
  ];

  var addHandlers = function () {
    setStatusFormFieldsets(NODES.formFieldsets, 'add');
    NODES.inputAddress.value = window.pin.calcMainPinCoordinates();
    window.util.setHandlers(HANDLERS_DATA);
  };

  window.form = {
    setStatusFieldsets: setStatusFormFieldsets,
    nodes: NODES,
    addHandlers: addHandlers
  };
})();
