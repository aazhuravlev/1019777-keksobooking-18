'use strict';

(function () {
  var TIME = ['12:00', '13:00', '14:00'];
  var INPUT_SHADOW_COLOR = '0 0 2px 2px #ff0000';
  var FILE_LOADER_HOVER_COLOR = '#ff5635';
  var CapacityValues = {
    '1': [2],
    '2': [1, 2],
    '3': [0, 1, 2],
    '100': [3]
  };

  var DefaultValues = {
    ROOM_SELECT: '1',
    CAPACITY_SELECT: '1',
    TIME_IN_SELECT: TIME[0],
    TIME_OUT_SELECT: TIME[0]
  };

  var TypeSelectOptions = {
    BUNGALO: '0',
    FLAT: '1000',
    HOUSE: '5000',
    PALACE: '10000'
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

  var SelectorsData = {
    FORM: '.ad-form',
    FORM_RESET: '.ad-form__reset',
    INPUT_ADDRESS: '#address',
    AD_TITLE: '#title',
    TYPE_SELECT: '#type',
    ROOM_SELECT: '#room_number',
    CAPACITY_SELECT: '#capacity',
    TIME_IN_SELECT: '#timein',
    TIME_OUT_SELECT: '#timeout',
    PRICE_PER_NIGHT: '#price',
    DESCRIPTION: '#description',
    FEATURES: '.features',
    AVATAR_CHOOSER: '.ad-form__field input[type=file]',
    AVATAR_PREWIEV: '.ad-form-header__preview img',
    LODGING_PHOTO_CHOOSER: '.ad-form__upload input[type=file]',
    PHOTO_CONTAINER: '.ad-form__photo-container',
    LOADED_PHOTOS_CONTAINER: '.ad-form__photo-container',
    LOADED_PHOTO_CONTAINER: '.ad-form__photo',
    AVATAR_DROP_ZONE: '.ad-form-header__drop-zone',
    LODGING_DROP_ZONE: '.ad-form__drop-zone',
    AVATAR_INPUT_CHOOSER: '#avatar',
    IMAGE_INPUT_CHOOSER: '#images'
  };

  var Nodes = window.util.findNodes(SelectorsData);
  Nodes.FORM_FIELDSETS = Nodes.FORM.querySelectorAll('fieldset');
  Nodes.CAPACITY_OPTIONS = Nodes.CAPACITY_SELECT.querySelectorAll('option');

  var Indexes = {
    FLAT: '1',
    NODE: '0',
    ATTRIBUTE: '1',
    VALUE: '2'
  };

  var DEFAULT_DATA = [
    [Nodes.AD_TITLE, VALUE_FIELD, ''],
    [Nodes.TYPE_SELECT, VALUE_FIELD, Object.keys(window.card.accomodationTypes)[Indexes.FLAT].toLowerCase()],
    [Nodes.PRICE_PER_NIGHT, VALUE_FIELD, ''],
    [Nodes.PRICE_PER_NIGHT, PLACEHOLDER_FIELD, TypeSelectOptions.FLAT],
    [Nodes.PRICE_PER_NIGHT, PLACEHOLDER_FIELD, TypeSelectOptions.FLAT],
    [Nodes.ROOM_SELECT, VALUE_FIELD, DefaultValues.ROOM_SELECT],
    [Nodes.CAPACITY_SELECT, VALUE_FIELD, DefaultValues.CAPACITY_SELECT],
    [Nodes.TIME_IN_SELECT, VALUE_FIELD, DefaultValues.TIME_IN_SELECT],
    [Nodes.TIME_OUT_SELECT, VALUE_FIELD, DefaultValues.TIME_OUT_SELECT],
    [Nodes.DESCRIPTION, VALUE_FIELD, '']
  ];

  var setStatusFormFieldsets = function (selector, action) {
    Nodes.FORM.classList[action]('ad-form--disabled');
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
    Nodes.PRICE_PER_NIGHT.placeholder = TypeSelectOptions[Nodes.TYPE_SELECT.value.toUpperCase()];
    Nodes.PRICE_PER_NIGHT.min = TypeSelectOptions[Nodes.TYPE_SELECT.value.toUpperCase()];
    if (!Nodes.PRICE_PER_NIGHT.checkValidity()) {
      Nodes.PRICE_PER_NIGHT.reportValidity();
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
    Nodes.CAPACITY_OPTIONS.forEach(function (item) {
      item.disabled = true;
    });
    CapacityValues[Nodes.ROOM_SELECT.value].forEach(function (item) {
      Nodes.CAPACITY_OPTIONS[item].disabled = false;
    });
    Nodes.CAPACITY_OPTIONS[CapacityValues[Nodes.ROOM_SELECT.value][0]].selected = true;
  };

  var timeInSelectHandler = function () {
    Nodes.TIME_OUT_SELECT[TIME.indexOf(Nodes.TIME_IN_SELECT.value)].selected = true;
  };

  var timeOutSelectHandler = function () {
    Nodes.TIME_IN_SELECT[TIME.indexOf(Nodes.TIME_OUT_SELECT.value)].selected = true;
  };

  var setDefaultValues = function (arr) {
    arr.forEach(function (key) {
      key[Indexes.NODE][key[Indexes.ATTRIBUTE]] = key[Indexes.VALUE];
    });
  };

  var setInputAddressValue = function (value) {
    Nodes.INPUT_ADDRESS.value = value;
  };

  var unCheckInput = function (nodes) {
    var features = nodes.querySelectorAll('input:checked');
    features.forEach(function (node) {
      node.checked = false;
    });
  };

  var formReset = function () {
    window.card.nodes.MAP.classList.add('map--faded');
    setStatusFormFieldsets(Nodes.FORM_FIELDSETS, 'add');
    setInputAddressValue(window.pin.mainPinCoordinates());
    removeNode(window.pin.nodes.RENDERED_PINS);
    removeNode(Nodes.LOADED_PHOTOS);
    window.card.remove();
    window.pin.nodes.MAIN_PIN.style.top = window.pin.main.START_Y + 'px';
    window.pin.nodes.MAIN_PIN.style.left = window.pin.main.START_X + 'px';
    Nodes.IMAGE_INPUT_CHOOSER.value = '';
    Nodes.AVATAR_INPUT_CHOOSER.value = '';
    setDefaultValues(DEFAULT_DATA);
    unCheckInput(Nodes.FEATURES);
    removeShadow(Nodes.AD_TITLE);
    removeShadow(Nodes.PRICE_PER_NIGHT);
    window.filter.reset();
    Nodes.AVATAR_PREWIEV.src = 'img/muffin-grey.svg';
    window.pin.nodes.PINS.removeEventListener('click', window.pin.clickHandler);
    window.pin.nodes.MAIN_PIN.addEventListener('keydown', window.pin.mapEnterPressHandler);
    window.pin.nodes.MAIN_PIN.addEventListener('click', window.pin.mainPinClickHandler);
    window.util.removeHandlers(HANDLERS_DATA);
    window.filter.nodes.MAP_FILTERS.removeEventListener('change', window.filter.debouncedHandler);
  };

  var sendFormHandler = function () {
    formReset();
    window.dom.renderSuccessPopupHandler();
    Nodes.FORM.removeEventListener('submit', submitHandler);
  };

  var checkValidationHandler = function () {
    var adTilteValidationResult = validateInput(Nodes.AD_TITLE)();
    var pricePerNightValidationResult = validateInput(Nodes.PRICE_PER_NIGHT)();
    if (adTilteValidationResult && pricePerNightValidationResult) {
      return true;
    }
    return false;
  };

  var submitHandler = function (evt) {
    checkValidationHandler();
    if (checkValidationHandler()) {
      window.backend.save(new FormData(Nodes.FORM), sendFormHandler, window.dom.renderErrorPopupHandler('save'));
    }
    evt.preventDefault();
  };

  var avatarLoadHandler = function (src) {
    return function () {
      Nodes.AVATAR_PREWIEV.src = src.result;
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
      Nodes.LOADED_PHOTO_PREVIEW_CONTAINER = Nodes.LOADED_PHOTOS_CONTAINER.querySelector('.ad-form__photo');
      var newLoadedPhotoContainer = Nodes.LOADED_PHOTO_CONTAINER.cloneNode();
      newLoadedPhotoContainer.classList.add('ad-form__photo--loaded');
      newLoadedPhotoContainer.appendChild(getLoadedPhoto(src.result));
      Nodes.PHOTO_CONTAINER.insertBefore(newLoadedPhotoContainer, Nodes.LOADED_PHOTO_PREVIEW_CONTAINER);
      Nodes.LOADED_PHOTOS = Nodes.LOADED_PHOTOS_CONTAINER.querySelectorAll('.ad-form__photo--loaded');
      return Nodes.LOADED_PHOTOS;
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

  var AVATAR_PHOTO_CHOOSER_HANDLER = photoChooserHandler(avatarLoadHandler, Nodes.AVATAR_INPUT_CHOOSER);
  var LODGING_PHOTO_CHOOSER_HANDLER = photoChooserHandler(lodgingPhotoRenderHandler, Nodes.IMAGE_INPUT_CHOOSER);

  var HANDLERS_DATA = [
    [Nodes.AD_TITLE, 'blur', validateInput(Nodes.AD_TITLE)],
    [Nodes.TYPE_SELECT, 'change', typeSelectChangeHandler],
    [Nodes.PRICE_PER_NIGHT, 'blur', validateInput(Nodes.PRICE_PER_NIGHT)],
    [Nodes.ROOM_SELECT, 'change', changeRoomsHandler],
    [Nodes.TIME_IN_SELECT, 'change', timeInSelectHandler],
    [Nodes.TIME_OUT_SELECT, 'change', timeOutSelectHandler],
    [Nodes.FORM_RESET, 'click', formReset],
    [Nodes.AVATAR_CHOOSER, 'change', AVATAR_PHOTO_CHOOSER_HANDLER],
    [Nodes.LODGING_PHOTO_CHOOSER, 'change', LODGING_PHOTO_CHOOSER_HANDLER],
    [Nodes.AVATAR_DROP_ZONE, 'dragover', dragoverFileLoaderHandler],
    [Nodes.LODGING_DROP_ZONE, 'dragover', dragoverFileLoaderHandler],
    [Nodes.AVATAR_DROP_ZONE, 'dragleave', dragleaveFileLoaderHandler],
    [Nodes.LODGING_DROP_ZONE, 'dragleave', dragleaveFileLoaderHandler],
    [Nodes.AVATAR_DROP_ZONE, 'drop', AVATAR_PHOTO_CHOOSER_HANDLER],
    [Nodes.LODGING_DROP_ZONE, 'drop', LODGING_PHOTO_CHOOSER_HANDLER]
  ];

  var addHandlers = function () {
    Nodes.FORM.addEventListener('submit', submitHandler);
    setStatusFormFieldsets(Nodes.FORM_FIELDSETS, 'remove');
    setInputAddressValue(window.pin.mainPinCoordinates());
    window.util.setHandlers(HANDLERS_DATA);
  };

  var setDisabledStatusForm = function () {
    setStatusFormFieldsets(Nodes.FORM_FIELDSETS, 'add');
  };

  window.form = {
    setStatusFieldsets: setStatusFormFieldsets,
    nodes: Nodes,
    addHandlers: addHandlers,
    unCheckInput: unCheckInput,
    setDisabledStatus: setDisabledStatusForm
  };
})();
