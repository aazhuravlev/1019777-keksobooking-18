'use strict';

(function () {
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

  var SELECTORS_DATA = {
    housingType: '#housing-type',
    housingPrice: '#housing-price',
    housingRooms: '#housing-rooms',
    housingGuests: '#housing-guests',
    housingFeatures: '#housing-features',
    mapFilters: '.map__filters'
  };

  var NODES = window.util.findNodes(SELECTORS_DATA);

  var checkPriceRange = function (value) {
    if (value <= PRICE_RANGE.low) {
      return PRICE_LEVEL.low;
    } else if (value > PRICE_RANGE.high) {
      return PRICE_LEVEL.high;
    }
    return PRICE_LEVEL.middle;
  };

  var checkHousingType = function (item) {
    return NODES.housingType.value === ANY_OPTION ? item : item.offer.type === NODES.housingType.value;
  };

  var checkHousingPrice = function (item) {
    return NODES.housingPrice.value === ANY_OPTION ? item : checkPriceRange(item.offer.price) === NODES.housingPrice.value;
  };

  var checkHousingRooms = function (item) {
    return NODES.housingRooms.value === ANY_OPTION ? item : String(item.offer.rooms) === NODES.housingRooms.value;
  };

  var checkHousinGuests = function (item) {
    return NODES.housingGuests.value === ANY_OPTION ? item : String(item.offer.guests) === NODES.housingGuests.value;
  };

  var getHousingFeatures = function () {
    var features = [];
    var checkedInputs = NODES.housingFeatures.querySelectorAll('input:checked');
    checkedInputs.forEach(function (input) {
      features.push(input.value);
    });
    return features;
  };

  var compareFeatures = function (arr1, arr2) {
    for (var i = 0; i < arr2.length; i++) {
      if (!arr1.includes(arr2[i])) {
        return false;
      }
    }
    return true;
  };

  var filterCheckboxes = function (item) {
    return compareFeatures(item.offer.features, getHousingFeatures()) ? item : false;
  };

  var getFilteringData = function (loadedData) {
    return loadedData.filter(function (item) {
      return checkHousingType(item) && checkHousingPrice(item) && checkHousingRooms(item) && checkHousinGuests(item) && filterCheckboxes(item);
    });
  };

  var debouncedFilterHandler = window.util.debounce(function () {
    window.pin.render(window.data.updateData());
    window.card.remove();
  });

  var addHandlers = function () {
    NODES.mapFilters.addEventListener('change', debouncedFilterHandler);
  };

  window.filter = {
    getFilteringData: getFilteringData,
    addHandlers: addHandlers
  };
})();
