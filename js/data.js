'use strict';

(function () {
  var data = [];
  var isLoading;

  var getData = function () {
    return data;
  };

  var filterData = function () {
    var cloneData = getData().slice();
    var filteredData = window.filter.getFilteringData(cloneData);
    return filteredData;
  };

  var loadData = function () {
    if (data.length > 0 || isLoading) {
      return;
    }
    var onLoad = function (result) {
      data = result;
      window.pin.addHandlers();
      return data;
    };
    isLoading = true;
    window.backend.load(onLoad, window.dom.errorPopupRenderHandler('load'));
  };

  window.data = {
    loadData: loadData,
    filterData: filterData
  };
})();
