'use strict';

(function () {
  var SelectorsData = {
    ERROR_POPUP_TEMPLATE: '#error',
    SUCCESS_POPUP_TEMPLATE: '#success',
    MAIN: 'main',
  };

  var Nodes = window.util.findNodes(SelectorsData);
  Nodes.ERROR_POPUP = Nodes.ERROR_POPUP_TEMPLATE.content.querySelector('.error');
  Nodes.SUCCESS_POPUP = Nodes.SUCCESS_POPUP_TEMPLATE.content.querySelector('.success');

  var openMap = function () {
    window.card.nodes.MAP.classList.remove('map--faded');
    window.form.setStatusFieldsets(window.form.nodes.FORM_FIELDSETS, 'remove');
    window.pin.render(window.data.getFiltered(window.data.get()));
    window.form.nodes.INPUT_ADDRESS.value = window.pin.mainPinCoordinates();
    window.pin.nodes.MAIN_PIN.addEventListener('mousedown', window.pin.dragHandler);
    window.pin.nodes.PINS.addEventListener('click', window.pin.clickHandler);
    window.form.addHandlers();
    window.filter.addHandlers();
  };

  var renderSuccessPopupHandler = function () {
    var successPopup = Nodes.SUCCESS_POPUP.cloneNode(true);
    Nodes.MAIN.appendChild(successPopup);
    document.addEventListener('click', removeSuccessPopupHandler('click'));
    document.addEventListener('keydown', removeSuccessPopupHandler('keydown'));
  };

  var renderErrorPopupHandler = function (action) {
    return function () {
      var errorPopup = Nodes.ERROR_POPUP.cloneNode(true);
      Nodes.MAIN.appendChild(errorPopup);
      Nodes.ERROR_BUTTON = document.querySelector('.error__button');
      if (action === 'save') {
        Nodes.ERROR_BUTTON.addEventListener('click', removeErrorPopupHandler('click'));
        document.addEventListener('click', removeErrorPopupHandler('click'));
        document.addEventListener('keydown', removeErrorPopupHandler('keydown'));
      } else if (action === 'load') {
        Nodes.ERROR_BUTTON.addEventListener('click', windowReloadHandler);
      }
      return Nodes.ERROR_BUTTON;
    };
  };

  var removePopupHandler = function (evt, action, popup) {
    if (popup) {
      Nodes.POPUP_TEXT = popup.querySelector('p');
      if (action === 'click' && evt.target !== Nodes.POPUP_TEXT) {
        popup.remove();
      } else if (action === 'keydown' && evt.keyCode === window.card.escKeycode) {
        popup.remove();
      }
    }
  };

  var removeSuccessPopupHandler = function (action) {
    return function (evt) {
      Nodes.RENDERED_SUCCESS_POPUP = document.querySelector('.success');
      removePopupHandler(evt, action, Nodes.RENDERED_SUCCESS_POPUP);
      document.removeEventListener('click', removeSuccessPopupHandler('click'));
      document.removeEventListener('keydown', removeSuccessPopupHandler('keydown'));
    };
  };

  var removeErrorPopupHandler = function (action) {
    return function (evt) {
      Nodes.RENDERED_ERROR_POPUP = document.querySelector('.error');
      removePopupHandler(evt, action, Nodes.RENDERED_ERROR_POPUP);
      Nodes.ERROR_BUTTON.removeEventListener('click', removeErrorPopupHandler('click'));
      document.removeEventListener('click', removeErrorPopupHandler('click'));
      document.removeEventListener('keydown', removeErrorPopupHandler('keydown'));
    };
  };

  var windowReloadHandler = function () {
    location.reload();
    Nodes.ERROR_BUTTON.removeEventListener('click', windowReloadHandler);
  };

  window.dom = {
    openMap: openMap,
    renderSuccessPopupHandler: renderSuccessPopupHandler,
    renderErrorPopupHandler: renderErrorPopupHandler
  };
})();
