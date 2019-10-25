'use strict';

(function () {
  var data = [];
  var isLoading;

  var getData = function () {
    return data;
  };

  var updateData = function () {
    var cloneData = getData().slice();
    window.pin.render(window.filter.getFilteringData(cloneData));
    return window.filter.getFilteringData(cloneData);
  };

  var loadData = function () {
    if (data.length > 0 || isLoading) {
      return;
    }
    var onLoad = function (result) {
      data = result;
      window.dom.addHandlers();
      return data;
    };
    isLoading = true;
    window.backend.load(onLoad, window.dom.errorHandler);
  };

  window.data = {
    getData: getData,
    loadData: loadData,
    updateData: updateData
  };
})();
