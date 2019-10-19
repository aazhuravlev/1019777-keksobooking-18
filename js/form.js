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

  var STANDART_VALUES = {
    roomSelect: '1',
    capacitySelect: '1',
    timeInSelect: TIME[0],
    timeOutSelect: TIME[0]
  };
  var TYPE_SELECT_OPTIONS = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  var VALUE_FIELD = 'value';
  var PLACEHOLDER_FIELD = 'placeholder';
  var DISABLED_STATUS = 'disabled';

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
    pricePerNight: '#price',
    description: '#description'
  };

  var NODES = window.util.findNodes(SELECTORS_DATA);
  NODES.formFieldsets = NODES.form.querySelectorAll('fieldset');
  NODES.capacityOptions = NODES.capacitySelect.querySelectorAll('option');

  var INDEXES = {
    flat: '1',
    node: '0',
    attribute: '1',
    value: '2'
  };

  var STANDART_DATA = [
    [NODES.adTitle, VALUE_FIELD, ''],
    [NODES.typeSelect, VALUE_FIELD, Object.keys(window.card.types)[INDEXES.flat]],
    [NODES.pricePerNight, VALUE_FIELD, ''],
    [NODES.pricePerNight, PLACEHOLDER_FIELD, TYPE_SELECT_OPTIONS.flat],
    [NODES.pricePerNight, PLACEHOLDER_FIELD, TYPE_SELECT_OPTIONS.flat],
    [NODES.roomSelect, VALUE_FIELD, STANDART_VALUES.roomSelect],
    [NODES.capacitySelect, VALUE_FIELD, STANDART_VALUES.capacitySelect],
    [NODES.timeInSelect, VALUE_FIELD, STANDART_VALUES.timeInSelect],
    [NODES.timeOutSelect, VALUE_FIELD, STANDART_VALUES.timeOutSelect],
    [NODES.description, VALUE_FIELD, ''],
    [NODES.inputAddress, DISABLED_STATUS, true]
  ];

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

  var removeNode = function (node) {
    node.forEach(function (item) {
      item.remove();
    });
  };

  var addShadow = function (node) {
    node.style.boxShadow = INPUT_SHADOW_COLOR;
  };

  var removeShadow = function (node) {
    node.removeAttribute('style');
  };

  var adTitleChangeHandler = function () {
    if (!NODES.adTitle.checkValidity()) {
      NODES.adTitle.reportValidity();
      addShadow(NODES.adTitle);
    } else {
      removeShadow(NODES.adTitle);
    }
  };

  var typeSelectChangeHandler = function () {
    NODES.pricePerNight.placeholder = TYPE_SELECT_OPTIONS[NODES.typeSelect.value];
    NODES.pricePerNight.min = TYPE_SELECT_OPTIONS[NODES.typeSelect.value];
    if (!NODES.pricePerNight.checkValidity()) {
      NODES.pricePerNight.reportValidity();
    }
  };

  var pricePerNightHandler = function () {
    if (!NODES.pricePerNight.checkValidity()) {
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

  var setStandartValues = function (arr) {
    arr.forEach(function (key) {
      key[INDEXES.node][key[INDEXES.attribute]] = key[INDEXES.value];
    });
  };

  var formReset = function () {
    window.card.nodes.map.classList.add('map--faded');
    setStatusFormFieldsets(NODES.formFieldsets, 'add');
    NODES.inputAddress.value = window.pin.calcMainPinCoordinates();
    removeNode(window.pin.nodes.pins.querySelectorAll('[type]'));
    window.card.remove();
    window.pin.nodes.mainPin.style.top = window.pin.mainPin.startY + 'px';
    window.pin.nodes.mainPin.style.left = window.pin.mainPin.startX + 'px';
    setStandartValues(STANDART_DATA);
  };

  var sendFormHandler = function () {
    formReset();
    window.dom.saveSuccessHandler();
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

  var submitHandler = function (evt) {
    NODES.inputAddress.disabled = true;
    window.backend.save(new FormData(NODES.form), sendFormHandler, window.dom.saveErrorHandler);
    evt.preventDefault();
  };

  var addHandlers = function () {
    setStatusFormFieldsets(NODES.formFieldsets, 'add');
    NODES.inputAddress.value = window.pin.calcMainPinCoordinates();
    window.util.setHandlers(HANDLERS_DATA);
    NODES.form.addEventListener('submit', submitHandler);
  };

  window.form = {
    setStatusFieldsets: setStatusFormFieldsets,
    nodes: NODES,
    addHandlers: addHandlers,
    submitHandler: submitHandler
  };
})();
