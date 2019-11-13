'use strict';

(function () {
  var Url = {
    SAVE: 'https://js.dump.academy/keksobooking',
    LOAD: 'https://js.dump.academy/keksobooking/data'
  };

  var Xhr = {
    TIMEOUT: 10000,
    SUCCESS: 200,
    JSON_RESPONSE_TYPE: 'json'
  };

  var xhrHandler = function (xhr, onLoad, onError) {
    xhr.responseType = Xhr.JSON_RESPONSE_TYPE;
    xhr.addEventListener('load', function () {
      if (xhr.status === Xhr.SUCCESS) {
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

    xhr.timeout = Xhr.TIMEOUT;
  };

  var save = function (data, onLoad, onError, url) {
    var xhr = new XMLHttpRequest();
    xhrHandler(xhr, onLoad, onError);
    xhr.open('POST', url);
    xhr.send(data);
  };

  var load = function (onLoad, onError, url) {
    var xhr = new XMLHttpRequest();
    xhrHandler(xhr, onLoad, onError);
    xhr.open('GET', url);
    xhr.send();
  };

  window.backend = {
    load: load,
    save: save,
    url: Url
  };
})();
