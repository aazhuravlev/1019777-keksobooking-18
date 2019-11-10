'use strict';

(function () {
  var data = [];
  var filteredData = [];
  var isLoading;

  var getData = function () {
    return data;
  };

  var getFilteredData = function (shouldFilter) {
    if (filteredData && !shouldFilter) {
      return filteredData;
    }
    filteredData = window.filter.data(shouldFilter.slice());
    return filteredData;
  };

  var loadData = function (handler) {
    if (data.length > 0 || isLoading) {
      return;
    }
    var onLoad = function (result) {
      data = result;
      handler();
      return data;
    };
    isLoading = true;
    window.backend.load(onLoad, window.dom.renderErrorPopupHandler('load'));
  };

  window.data = {
    load: loadData,
    get: getData,
    getFiltered: getFilteredData
  };
})();
