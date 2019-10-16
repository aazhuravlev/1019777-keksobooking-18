'use strict';

(function () {
  var ERROR_TEMPLATE = document.querySelector('#error');
  var ERROR_POPUP = ERROR_TEMPLATE.content.querySelector('.error');
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

  var errorHandler = function () {
    renderErrorPopup();
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

  window.backend = {
    load: load,
    //  save: save,
    errorHandler: errorHandler
  };
})();
