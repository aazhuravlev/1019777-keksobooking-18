'use strict';

(function () {
  var ENTER_KEYCODE = 13;

  var MAP_BORDER = {
    minX: 0,
    maxX: 1138,
    minY: 130,
    maxY: 630
  };

  var SELECTORS_DATA = {
    errorTemplate: '#error',
    successTemplate: '#success',
    main: 'main',
    housingType: '#housing-type',
    housingPrice: '#housing-price',
    housingRooms: '#housing-rooms',
    housingGuests: '#housing-guests',
    housingFeatures: '#housing-features',
    mapFilters: '.map__filters'
  };

  var NODES = window.util.findNodes(SELECTORS_DATA);
  var ERROR_POPUP = NODES.errorTemplate.content.querySelector('.error');
  var SUCCESS_POPUP = NODES.successTemplate.content.querySelector('.success');
  NODES.housingFeaturesInput = NODES.housingFeatures.querySelectorAll('input');

  var mapEnterPressHandler = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openMap();
    }
  };

  var openMap = function () {
    window.card.nodes.map.classList.remove('map--faded');
    window.form.setStatusFieldsets(window.form.nodes.formFieldsets, 'remove');
    window.data.updateData();
    window.form.nodes.inputAddress.value = window.pin.calcActiveMainPinCoordinates();
    window.pin.nodes.mainPin.removeEventListener('click', openMap);
    window.pin.nodes.mainPin.addEventListener('mousedown', dragHandler);
  };

  var setMainPinBorderMoving = function (coordinate, min, max) {
    if (coordinate <= min) {
      coordinate = min;
    } else if (coordinate >= max) {
      coordinate = max;
    }
    return coordinate;
  };

  var dragHandler = function (evt) {
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

      var actualX = window.pin.nodes.mainPin.offsetLeft - shift.x;
      var actualY = window.pin.nodes.mainPin.offsetTop - shift.y;

      var triangleActualX = setMainPinBorderMoving(actualX, MAP_BORDER.minX, MAP_BORDER.maxX) - shift.x + window.pin.mainPin.width / 2;
      var triangleActualY = setMainPinBorderMoving(actualY, MAP_BORDER.minY, MAP_BORDER.maxY) + window.pin.mainPin.fullHeight;

      window.pin.nodes.mainPin.style.top = setMainPinBorderMoving(actualY, MAP_BORDER.minY, MAP_BORDER.maxY) + 'px';
      window.pin.nodes.mainPin.style.left = setMainPinBorderMoving(actualX, MAP_BORDER.minX, MAP_BORDER.maxX) + 'px';
      window.form.nodes.inputAddress.value = triangleActualX + ', ' + triangleActualY;
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var renderSuccessPopup = function () {
    var successPopup = SUCCESS_POPUP.cloneNode(true);
    NODES.main.appendChild(successPopup);
  };

  var renderErrorPopup = function () {
    var errorPopup = ERROR_POPUP.cloneNode(true);
    NODES.main.appendChild(errorPopup);
  };

  var successPopupRemoveClickHandler = function () {
    var renderedSuccessPopup = document.querySelector('.success');
    if (renderedSuccessPopup) {
      renderedSuccessPopup.remove();
    }
  };

  var successPopupRemoveKeydownHandler = function (evt) {
    if (evt.keyCode === window.card.escKeycode) {
      var renderedSuccessPopup = document.querySelector('.success');
      if (renderedSuccessPopup) {
        renderedSuccessPopup.remove();
      }
    }
  };

  var saveSuccessHandler = function () {
    renderSuccessPopup();
    document.addEventListener('click', successPopupRemoveClickHandler);
    document.addEventListener('keydown', successPopupRemoveKeydownHandler);
  };

  var errorPopupRemoveClickHandler = function () {
    var renderedErrorPopup = document.querySelector('.error');
    if (renderedErrorPopup) {
      renderedErrorPopup.remove();
    }
  };

  var errorPopupRemoveKeydownHandler = function (evt) {
    if (evt.keyCode === window.card.escKeycode) {
      var renderedErrorPopup = document.querySelector('.error');
      if (renderedErrorPopup) {
        renderedErrorPopup.remove();
      }
    }
  };

  var saveErrorHandler = function () {
    renderErrorPopup();
    var errorButton = document.querySelector('.error__button');
    errorButton.addEventListener('click', errorPopupRemoveClickHandler);
    document.addEventListener('click', errorPopupRemoveClickHandler);
    document.addEventListener('keydown', errorPopupRemoveKeydownHandler);
  };

  var windowReloadHandler = function () {
    location.reload();
  };

  var errorHandler = function () {
    renderErrorPopup();
    var errorButton = document.querySelector('.error__button');
    errorButton.addEventListener('click', windowReloadHandler);
  };

  var HANDLERS_DATA = [
    [NODES.mapFilters, window.form.eventHandlers.change, window.data.updateDataDebounced],
    [window.pin.nodes.mainPin, window.form.eventHandlers.mousedown, openMap],
    [window.pin.nodes.mainPin, window.form.eventHandlers.keydown, mapEnterPressHandler]
  ];

  var addHandlers = function () {
    window.util.setHandlers(HANDLERS_DATA);
  };

  window.dom = {
    addHandlers: addHandlers,
    errorHandler: errorHandler,
    saveErrorHandler: saveErrorHandler,
    saveSuccessHandler: saveSuccessHandler,
    nodes: NODES
  };
})();
