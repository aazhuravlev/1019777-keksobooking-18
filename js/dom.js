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
    main: 'main'
  };

  var NODES = window.util.findNodes(SELECTORS_DATA);
  var ERROR_POPUP = NODES.errorTemplate.content.querySelector('.error');
  var SUCCESS_POPUP = NODES.successTemplate.content.querySelector('.success');

  var mapEnterPressHandler = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openMap();
    }
  };

  var openMap = function () {
    window.card.nodes.map.classList.remove('map--faded');
    window.form.setStatusFieldsets(window.form.nodes.formFieldsets, 'remove');
    window.pin.render(window.data.getData());
    window.form.nodes.inputAddress.value = window.pin.calcActiveMainPinCoordinates();
    window.pin.nodes.mainPin.removeEventListener('click', openMap);
    window.pin.nodes.mainPin.addEventListener('mousedown', dragHandler);
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

      if (actualX <= MAP_BORDER.minX) {
        actualX = MAP_BORDER.minX;
      } else if (actualX >= MAP_BORDER.maxX) {
        actualX = MAP_BORDER.maxX;
      }
      if (actualY <= MAP_BORDER.minY) {
        actualY = MAP_BORDER.minY;
      } else if (actualY >= MAP_BORDER.maxY) {
        actualY = MAP_BORDER.maxY;
      }

      var triangleActualX = actualX - shift.x + window.pin.mainPin.width / 2;
      var triangleActualY = actualY + window.pin.mainPin.fullHeight;

      window.pin.nodes.mainPin.style.top = actualY + 'px';
      window.pin.nodes.mainPin.style.left = actualX + 'px';
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

  var addHandlers = function () {
    window.pin.nodes.mainPin.addEventListener('mousedown', openMap);
    window.pin.nodes.mainPin.addEventListener('keydown', mapEnterPressHandler);
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
    var renderedSuccessPopup = document.querySelector('.success');
    if (evt.keyCode === window.card.escKeycode) {
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
    var renderedErrorPopup = document.querySelector('.error');
    if (evt.keyCode === window.card.escKeycode) {
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

  window.dom = {
    addHandlers: addHandlers,
    errorHandler: errorHandler,
    saveErrorHandler: saveErrorHandler,
    saveSuccessHandler: saveSuccessHandler
  };
})();
