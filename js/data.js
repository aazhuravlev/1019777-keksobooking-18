'use strict';

(function () {
  var data = [];
  var isLoading;

  var getData = function () {
    return data;
  };

  var updateData = function () {
    var cloneData = getData().slice();
    var filteredData = window.filter.getFilteringData(cloneData);
    window.pin.render(filteredData);
    return filteredData;
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
