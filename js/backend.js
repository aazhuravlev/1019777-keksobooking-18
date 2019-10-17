'use strict';

(function () {
  var SELECTORS_DATA = {
    errorTemplate: '#error',
    errorPopup: '.error'
  };

  var NODES = window.util.findNodes(SELECTORS_DATA);
  var ERROR_POPUP = NODES.errorTemplate.content.querySelector('.error');
  //  var URL_SAVE = 'https://js.dump.academy/code-and-magick';
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';

  var xhrHandler = function (xhr, onLoad, onError) {
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;
  };
  /*
  var save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhrHandler(xhr, onLoad, onError);
    xhr.open('POST', URL_SAVE);
    xhr.send(data);
  };
*/
  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhrHandler(xhr, onLoad, onError);
    xhr.open('GET', URL_LOAD);
    xhr.send();
  };

  var renderErrorPopup = function () {
    var errorPopup = ERROR_POPUP.cloneNode(true);
    document.body.appendChild(errorPopup);
  };

  var windowReloadHandler = function () {
    location.reload();
  };

  var errorHandler = function () {
    renderErrorPopup();
    var errorButton = document.querySelector('.error__button');
    errorButton.addEventListener('click', windowReloadHandler);
    /*
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';


    document.body.insertAdjacentElement('afterbegin', node);
    */
  };
  var addHandlers = function () {

  };

  window.backend = {
    load: load,
    //  save: save,
    errorHandler: errorHandler,
    addHandlers: addHandlers
  };
})();
