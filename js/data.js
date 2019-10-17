'use strict';

(function () {
  var data = [];
  var isLoading;
  var getData = function () {
    return data;
  };

  var loadData = function () {
    if (data.length > 0 || isLoading) {
      console.log(data);
      return;
    }
    var onLoad = function (result) {
      data = result;
      window.dom.addHandlers();
      return data;
    };
    isLoading = true;
    window.backend.load(onLoad, window.dom.errorHandler);
    window.backend.load(onLoad, window.dom.errorHandler);
  };

  window.data = {
    getData: getData,
    loadData: loadData
  };
})();
