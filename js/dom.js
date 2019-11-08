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
    window.pin.render(window.data.getFiltered(window.data.get()));
    window.form.nodes.inputAddress.value = window.pin.mainPinCoordinates();
    window.pin.nodes.mainPin.addEventListener('mousedown', window.pin.dragHandler);
    window.pin.nodes.pins.addEventListener('click', window.pin.clickHandler);
    window.form.addHandlers();
    window.filter.addHandlers();
  };

  var renderSuccessPopupHandler = function () {
    var successPopup = SUCCESS_POPUP.cloneNode(true);
    NODES.main.appendChild(successPopup);
    document.addEventListener('click', removeSuccessPopupHandler('click'));
    document.addEventListener('keydown', removeSuccessPopupHandler('keydown'));
  };

  var renderErrorPopupHandler = function (action) {
    return function () {
      var errorPopup = ERROR_POPUP.cloneNode(true);
      NODES.main.appendChild(errorPopup);
      NODES.errorButton = document.querySelector('.error__button');
      if (action === 'save') {
        NODES.errorButton.addEventListener('click', removeErrorPopupHandler('click'));
        document.addEventListener('click', removeErrorPopupHandler('click'));
        document.addEventListener('keydown', removeErrorPopupHandler('keydown'));
      } else if (action === 'load') {
        NODES.errorButton.addEventListener('click', windowReloadHandler);
      }
      return NODES.errorButton;
    };
  };

  var removePopupHandler = function (evt, action, popup) {
    if (popup) {
      var successPopupText = popup.querySelector('p');
      if (action === 'click' && evt.target !== successPopupText) {
        popup.remove();
      } else if (action === 'keydown' && evt.keyCode === window.card.escKeycode) {
        popup.remove();
      }
    }
  };

  var removeSuccessPopupHandler = function (action) {
    return function (evt) {
      removePopupHandler(evt, action, document.querySelector('.success'));
      document.removeEventListener('click', removeSuccessPopupHandler('click'));
      document.removeEventListener('keydown', removeSuccessPopupHandler('keydown'));
    };
  };

  var removeErrorPopupHandler = function (action) {
    return function (evt) {
      removePopupHandler(evt, action, document.querySelector('.error'));
      NODES.errorButton.removeEventListener('click', removeErrorPopupHandler('click'));
      document.removeEventListener('click', removeErrorPopupHandler('click'));
      document.removeEventListener('keydown', removeErrorPopupHandler('keydown'));
    };
  };

  var windowReloadHandler = function () {
    location.reload();
    NODES.errorButton.removeEventListener('click', windowReloadHandler);
  };

  window.dom = {
    openMap: openMap,
    renderSuccessPopupHandler: renderSuccessPopupHandler,
    renderErrorPopupHandler: renderErrorPopupHandler
  };
})();
