'use strict';

(function () {
  var PINS_QUANTITY = 5;

  var PriceRange = {
    LOW: 10000,
    HIGH: 50000
  };

  var PriceLevel = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  var ANY_OPTION = 'any';

  var SelectorsData = {
    HOUSING_TYPE: '#housing-type',
    HOUSING_PRICE: '#housing-price',
    HOUSING_ROOMS: '#housing-rooms',
    HOUSING_GUESTS: '#housing-guests',
    HOUSING_FEATURES: '#housing-features',
    MAP_FILTERS: '.map__filters'
  };

  var Nodes = window.util.findNodes(SelectorsData);

  var FILTER_HOUSING_FIELDS = [Nodes.HOUSING_TYPE, Nodes.HOUSING_PRICE, Nodes.HOUSING_ROOMS, Nodes.HOUSING_GUESTS];

  var checkPriceRange = function (value) {
    if (value <= PriceRange.LOW) {
      return PriceLevel.LOW;
    } else if (value > PriceRange.HIGH) {
      return PriceLevel.HIGH;
    }
    return PriceLevel.MIDDLE;
  };

  var checkHousingType = function (item) {
    return Nodes.HOUSING_TYPE.value === ANY_OPTION ? item : item.offer.type === Nodes.HOUSING_TYPE.value;
  };

  var checkHousingPrice = function (item) {
    return Nodes.HOUSING_PRICE.value === ANY_OPTION ? item : checkPriceRange(item.offer.price) === Nodes.HOUSING_PRICE.value;
  };

  var checkHousingRooms = function (item) {
    return Nodes.HOUSING_ROOMS.value === ANY_OPTION ? item : String(item.offer.rooms) === Nodes.HOUSING_ROOMS.value;
  };

  var checkHousinGuests = function (item) {
    return Nodes.HOUSING_GUESTS.value === ANY_OPTION ? item : String(item.offer.guests) === Nodes.HOUSING_GUESTS.value;
  };

  var getHousingFeatures = function () {
    var features = [];
    var checkedInputs = Nodes.HOUSING_FEATURES.querySelectorAll('input:checked');
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

  var filterData = function (loadedData) {
    return loadedData.filter(function (item) {
      return checkHousingType(item) && checkHousingPrice(item) && checkHousingRooms(item) && checkHousinGuests(item) && filterCheckboxes(item);
    }).slice(0, PINS_QUANTITY);
  };

  var debouncedFilterHandler = window.util.debounce(function () {
    window.pin.render(window.data.getFiltered(window.data.get()));
    window.card.remove();
  });

  var setDefaultFilterFieldsOptions = function (arr) {
    arr.forEach(function (item) {
      item.value = ANY_OPTION;
    });
  };

  var resetFilter = function () {
    window.form.unCheckInput(Nodes.HOUSING_FEATURES);
    setDefaultFilterFieldsOptions(FILTER_HOUSING_FIELDS);
  };

  var addHandlers = function () {
    Nodes.MAP_FILTERS.addEventListener('change', debouncedFilterHandler);
  };

  window.filter = {
    data: filterData,
    addHandlers: addHandlers,
    reset: resetFilter,
    nodes: Nodes,
    debouncedHandler: debouncedFilterHandler
  };
})();
