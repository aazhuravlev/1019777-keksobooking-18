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

  window.dom = {
    openMap: openMap,
    errorHandler: errorHandler,
    saveErrorHandler: saveErrorHandler,
    saveSuccessHandler: saveSuccessHandler
  };
})();
