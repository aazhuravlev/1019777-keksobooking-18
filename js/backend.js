'use strict';

(function () {
  var Url = {
    SAVE: 'https://js.dump.academy/keksobooking',
    LOAD: 'https://js.dump.academy/keksobooking/data'
  };

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

  var save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhrHandler(xhr, onLoad, onError);
    xhr.open('POST', Url.SAVE);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhrHandler(xhr, onLoad, onError);
    xhr.open('GET', Url.LOAD);
    xhr.send();
  };

  window.backend = {
    load: load,
    save: save,
  };
})();
