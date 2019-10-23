'use strict';

(function () {
  var data = [];
  var isLoading;

  var getData = function () {
    return data;
  };

  var updateData = function () {
    var sameHousingType = data.filter(function (loadedData) {
      if (window.dom.nodes.housingType.value === 'any') {
        return getData;
      }
      return loadedData.offer.type === window.dom.nodes.housingType.value;
    });
    window.pin.render(sameHousingType);
    return sameHousingType;
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
