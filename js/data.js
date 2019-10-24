'use strict';

(function () {
  var data = [];
  var isLoading;
  var PRICE_RANGE = {
    low: 10000,
    high: 50000
  };
  var PRICE_LEVEL = {
    low: 'low',
    middle: 'middle',
    high: 'high'
  };
  var ANY_OPTION = 'any';

  var getData = function () {
    return data;
  };

  var checkPriceRange = function (value) {
    if (value <= PRICE_RANGE.low) {
      return PRICE_LEVEL.low;
    } else if (value > PRICE_RANGE.high) {
      return PRICE_LEVEL.high;
    } else if (value > PRICE_RANGE.low && value <= PRICE_RANGE.high) {
      return PRICE_LEVEL.middle;
    }
    return ANY_OPTION;
  };

  var checkHousingType = function (loadedData) {
    return window.dom.nodes.housingType.value === ANY_OPTION ? loadedData : loadedData.offer.type === window.dom.nodes.housingType.value;
  };

  var checkHousingPrice = function (loadedData) {
    return window.dom.nodes.housingPrice.value === ANY_OPTION ? loadedData : checkPriceRange(loadedData.offer.price) === window.dom.nodes.housingPrice.value;
  };

  var checkHousingRooms = function (loadedData) {
    return window.dom.nodes.housingRooms.value === ANY_OPTION ? loadedData : String(loadedData.offer.rooms) === window.dom.nodes.housingRooms.value;
  };

  var checkHousinGuests = function (loadedData) {
    return window.dom.nodes.housingGuests.value === ANY_OPTION ? loadedData : String(loadedData.offer.guests) === window.dom.nodes.housingGuests.value;
  };

  var checkHousinFeatures = function () {
    var features = [];
    window.dom.nodes.housingFeaturesInput.forEach(function (input) {
      if (input.checked) {
        features.push(input.value);
      }
    });
    return features;
  };

  var compareFeatures = function (arr1, arr2) {
    for (var i = 0; i < arr2.length; i++) {
      if (arr1.indexOf(arr2[i]) === -1) {
        return false;
      }
    }
    return true;
  };

  var filterCheckboxes = function (loadedData) {
    return compareFeatures(loadedData.offer.features, checkHousinFeatures()) ? loadedData : false;
  };

  var getFilteringData = function (loadedData) {
    return loadedData.filter(function (item) {
      return checkHousingType(item) && checkHousingPrice(item) && checkHousingRooms(item) && checkHousinGuests(item) && filterCheckboxes(item);
    });
  };

  var updateData = function () {
    var cloneData = getData().slice();
    window.pin.render(getFilteringData(cloneData));
    return getFilteringData(cloneData);
  };

  var updateDataDebounced = window.util.debounce(updateData);

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
    updateData: updateData,
    updateDataDebounced: updateDataDebounced
  };
})();
