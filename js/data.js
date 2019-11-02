'use strict';

(function () {
  var data = [];
  var filteredData = [];
  var isLoading;

  var getData = function () {
    return data;
  };

  var filterData = function () {
    var cloneData = getData().slice();
    filteredData = window.filter.getFilteringData(cloneData);
    return filteredData;
  };

  var getFilterData = function () {
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
    window.backend.load(onLoad, window.dom.renderErrorPopupHandler('load'));
  };

  window.data = {
    load: loadData,
    get: getData,
    filter: filterData,
    getFilter: getFilterData
  };
})();
