'use strict';

(function () {
  var TIME = ['12:00', '13:00', '14:00'];
  var INPUT_SHADOW_COLOR = '0 0 2px 2px #ff0000';
  var FILE_LOADER_HOVER_COLOR = '#ff5635';
  var CAPACITY_VALUES = {
    '1': [2],
    '2': [1, 2],
    '3': [0, 1, 2],
    '100': [3]
  };

  var DEFAULT_VALUES = {
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

  var FILE_TYPES = /\.(?:jp(?:e?g|e|2)|gif|png|tiff?|bmp|ico)$/i;

  var LOADED_IMG_PARAMETERS = {
    className: 'ad-form__image',
    width: '70',
    height: '70',
    alt: 'Фотография жилья',
  };

  var VALUE_FIELD = 'value';
  var PLACEHOLDER_FIELD = 'placeholder';

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
    description: '#description',
    features: '.features',
    avatarChooser: '.ad-form__field input[type=file]',
    avatarPreview: '.ad-form-header__preview img',
    lodgingPhotoChooser: '.ad-form__upload input[type=file]',
    lodgingPhotoPreview: '.ad-form__photo img',
    photoContainer: '.ad-form__photo-container',
    loadedPhotosContainer: '.ad-form__photo-container',
    loadedPhotoContainer: '.ad-form__photo',
    avatarDropZone: '.ad-form-header__drop-zone',
    lodgingDropZone: '.ad-form__drop-zone',
    avatarInputChooser: '#avatar',
    imageInputChooser: '#images'
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

  var DEFAULT_DATA = [
    [NODES.adTitle, VALUE_FIELD, ''],
    [NODES.typeSelect, VALUE_FIELD, Object.keys(window.card.types)[INDEXES.flat]],
    [NODES.pricePerNight, VALUE_FIELD, ''],
    [NODES.pricePerNight, PLACEHOLDER_FIELD, TYPE_SELECT_OPTIONS.flat],
    [NODES.pricePerNight, PLACEHOLDER_FIELD, TYPE_SELECT_OPTIONS.flat],
    [NODES.roomSelect, VALUE_FIELD, DEFAULT_VALUES.roomSelect],
    [NODES.capacitySelect, VALUE_FIELD, DEFAULT_VALUES.capacitySelect],
    [NODES.timeInSelect, VALUE_FIELD, DEFAULT_VALUES.timeInSelect],
    [NODES.timeOutSelect, VALUE_FIELD, DEFAULT_VALUES.timeOutSelect],
    [NODES.description, VALUE_FIELD, '']
  ];

  var setStatusFormFieldsets = function (selector, action) {
    NODES.form.classList[action]('ad-form--disabled');
    selector.forEach(function (item) {
      item.disabled = action !== 'remove';
    });
  };

  var removeNode = function (node) {
    if (node) {
      node.forEach(function (item) {
        item.remove();
      });
    }
  };

  var addShadow = function (node) {
    node.style.boxShadow = INPUT_SHADOW_COLOR;
  };

  var removeShadow = function (node) {
    node.removeAttribute('style');
  };

  var typeSelectChangeHandler = function () {
    NODES.pricePerNight.placeholder = TYPE_SELECT_OPTIONS[NODES.typeSelect.value];
    NODES.pricePerNight.min = TYPE_SELECT_OPTIONS[NODES.typeSelect.value];
    if (!NODES.pricePerNight.checkValidity()) {
      NODES.pricePerNight.reportValidity();
    }
  };

  var validateInput = function (node) {
    return function () {
      if (node.value === '') {
        addShadow(node);
        node.setCustomValidity('Заполните поле');
        node.reportValidity();
        return false;
      } else if (!node.checkValidity()) {
        node.setCustomValidity('');
        node.reportValidity();
        addShadow(node);
        return false;
      }
      removeShadow(node);
      return true;
    };
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

  var setDefaultValues = function (arr) {
    arr.forEach(function (key) {
      key[INDEXES.node][key[INDEXES.attribute]] = key[INDEXES.value];
    });
  };

  var setInputAddressValue = function (value) {
    NODES.inputAddress.value = value;
  };

  var unCheckInput = function (nodes) {
    var features = nodes.querySelectorAll('input:checked');
    features.forEach(function (node) {
      node.checked = false;
    });
  };

  var formReset = function () {
    window.card.nodes.map.classList.add('map--faded');
    setStatusFormFieldsets(NODES.formFieldsets, 'add');
    setInputAddressValue(window.pin.mainPinCoordinates());
    removeNode(window.pin.nodes.renderedPins);
    removeNode(NODES.loadedPhotos);
    window.card.remove();
    window.pin.nodes.mainPin.style.top = window.pin.mainPin.startY + 'px';
    window.pin.nodes.mainPin.style.left = window.pin.mainPin.startX + 'px';
    NODES.imageInputChooser.value = '';
    NODES.avatarInputChooser.value = '';
    setDefaultValues(DEFAULT_DATA);
    unCheckInput(NODES.features);
    removeShadow(NODES.adTitle);
    removeShadow(NODES.pricePerNight);
    window.filter.reset();
    NODES.avatarPreview.src = 'img/muffin-grey.svg';
    window.pin.nodes.pins.removeEventListener('click', window.pin.clickHandler);
    window.pin.nodes.mainPin.addEventListener('keydown', window.pin.mapEnterPressHandler);
    window.pin.nodes.mainPin.addEventListener('click', window.pin.mainPinClickHandler);
    window.util.removeHandlers(HANDLERS_DATA);
    window.filter.nodes.mapFilters.removeEventListener('change', window.filter.debouncedHandler);
  };

  var sendFormHandler = function () {
    formReset();
    window.dom.renderSuccessPopupHandler();
    NODES.form.removeEventListener('submit', submitHandler);
  };

  var checkValidationHandler = function () {
    var adTilteValidationResult = validateInput(NODES.adTitle)();
    var pricePerNightValidationResult = validateInput(NODES.pricePerNight)();
    if (adTilteValidationResult && pricePerNightValidationResult) {
      return true;
    }
    return false;
  };

  var submitHandler = function (evt) {
    checkValidationHandler();
    if (checkValidationHandler()) {
      window.backend.save(new FormData(NODES.form), sendFormHandler, window.dom.renderErrorPopupHandler('save'));
    }
    evt.preventDefault();
  };

  var avatarLoadHandler = function (src) {
    return function () {
      NODES.avatarPreview.src = src.result;
    };
  };

  var photoChooserHandler = function (handler, input) {
    return function (evt) {
      var files;
      if (evt.target.files) {
        files = evt.target.files;
      } else if (evt.dataTransfer.files) {
        files = evt.dataTransfer.files;
      }
      Array.prototype.forEach.call(files, function (file) {
        if (FILE_TYPES.test(file.name)) {
          var reader = new FileReader();
          reader.addEventListener('load', handler(reader));
          reader.readAsDataURL(file);
          dragleaveFileLoaderHandler(evt);
        }
        input.files = files;
      });
    };
  };

  var getLoadedPhoto = function (src) {
    var image = document.createElement('img');
    Object.assign(image, LOADED_IMG_PARAMETERS, {src: src});
    return image;
  };

  var lodgingPhotoRenderHandler = function (src) {
    return function () {
      NODES.loadedPhotoPreviewContainer = NODES.loadedPhotosContainer.querySelector('.ad-form__photo');
      var newLoadedPhotoContainer = NODES.loadedPhotoContainer.cloneNode();
      newLoadedPhotoContainer.classList.add('ad-form__photo--loaded');
      newLoadedPhotoContainer.appendChild(getLoadedPhoto(src.result));
      NODES.photoContainer.insertBefore(newLoadedPhotoContainer, NODES.loadedPhotoPreviewContainer);
      NODES.loadedPhotos = NODES.loadedPhotosContainer.querySelectorAll('.ad-form__photo--loaded');
      return NODES.loadedPhotos;
    };
  };

  var dragoverFileLoaderHandler = function (evt) {
    evt.target.style.color = FILE_LOADER_HOVER_COLOR;
    evt.target.style.borderColor = FILE_LOADER_HOVER_COLOR;
    evt.dataTransfer.dropEffect = 'copy';
    evt.preventDefault();
  };

  var dragleaveFileLoaderHandler = function (evt) {
    evt.target.removeAttribute('style');
    evt.preventDefault();
  };

  var AVATAR_PHOTO_CHOOSER_HANDLER = photoChooserHandler(avatarLoadHandler, NODES.avatarInputChooser);
  var LODGING_PHOTO_CHOOSER_HANDLER = photoChooserHandler(lodgingPhotoRenderHandler, NODES.imageInputChooser);

  var HANDLERS_DATA = [
    [NODES.adTitle, 'blur', validateInput(NODES.adTitle)],
    [NODES.typeSelect, 'change', typeSelectChangeHandler],
    [NODES.pricePerNight, 'blur', validateInput(NODES.pricePerNight)],
    [NODES.roomSelect, 'change', changeRoomsHandler],
    [NODES.timeInSelect, 'change', timeInSelectHandler],
    [NODES.timeOutSelect, 'change', timeOutSelectHandler],
    [NODES.formReset, 'click', formReset],
    [NODES.avatarChooser, 'change', AVATAR_PHOTO_CHOOSER_HANDLER],
    [NODES.lodgingPhotoChooser, 'change', LODGING_PHOTO_CHOOSER_HANDLER],
    [NODES.avatarDropZone, 'dragover', dragoverFileLoaderHandler],
    [NODES.lodgingDropZone, 'dragover', dragoverFileLoaderHandler],
    [NODES.avatarDropZone, 'dragleave', dragleaveFileLoaderHandler],
    [NODES.lodgingDropZone, 'dragleave', dragleaveFileLoaderHandler],
    [NODES.avatarDropZone, 'drop', AVATAR_PHOTO_CHOOSER_HANDLER],
    [NODES.lodgingDropZone, 'drop', LODGING_PHOTO_CHOOSER_HANDLER]
  ];

  var addHandlers = function () {
    NODES.form.addEventListener('submit', submitHandler);
    setStatusFormFieldsets(NODES.formFieldsets, 'remove');
    setInputAddressValue(window.pin.mainPinCoordinates());
    window.util.setHandlers(HANDLERS_DATA);
  };

  var setDisabledStatusForm = function () {
    setStatusFormFieldsets(NODES.formFieldsets, 'add');
  };

  window.form = {
    setStatusFieldsets: setStatusFormFieldsets,
    nodes: NODES,
    addHandlers: addHandlers,
    unCheckInput: unCheckInput,
    setDisabledStatus: setDisabledStatusForm
  };
})();
