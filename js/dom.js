'use strict';

(function () {
  var SELECTORS_DATA = {
    errorTemplate: '#error',
    successTemplate: '#success',
    main: 'main',
  };

  var NODES = window.util.findNodes(SELECTORS_DATA);
  var ERROR_POPUP = NODES.errorTemplate.content.querySelector('.error');
  var SUCCESS_POPUP = NODES.successTemplate.content.querySelector('.success');

  var openMap = function () {
    window.card.nodes.map.classList.remove('map--faded');
    window.form.setStatusFieldsets(window.form.nodes.formFieldsets, 'remove');
    window.pin.render(window.data.filterData());
    window.form.nodes.inputAddress.value = window.pin.mainPinCoordinates();
  };

  var successPopupRenderHandler = function () {
    var successPopup = SUCCESS_POPUP.cloneNode(true);
    NODES.main.appendChild(successPopup);
    document.addEventListener('click', successPopupRemoveClickHandler);
    document.addEventListener('keydown', successPopupRemoveKeydownHandler);
  };

  var errorPopupRenderHandler = function (action) {
    return function () {
      var errorPopup = ERROR_POPUP.cloneNode(true);
      NODES.main.appendChild(errorPopup);
      var errorButton = document.querySelector('.error__button');
      if (action === 'save') {
        errorButton.addEventListener('click', errorPopupRemoveClickHandler);
        document.addEventListener('click', errorPopupRemoveClickHandler);
        document.addEventListener('keydown', errorPopupRemoveKeydownHandler);
      } else if (action === 'load') {
        errorButton.addEventListener('click', windowReloadHandler);
      }
    };
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

  var windowReloadHandler = function () {
    location.reload();
  };

  window.dom = {
    openMap: openMap,
    successPopupRenderHandler: successPopupRenderHandler,
    errorPopupRenderHandler: errorPopupRenderHandler
  };
})();
