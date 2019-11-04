'use strict';

(function () {
  var TYPES = {palace: 'Дворец', flat: 'Квартира', house: 'Дом', bungalo: 'Бунгало'};
  var ROOM_DECLINATION_VALUES = [' комната', ' комнаты', ' комнат'];
  var GUEST_DECLINATION_VALUES = [' гостя', ' гостей', ' гостей'];
  var ESC_KEYCODE = 27;

  var TEXT_CONTENT = 'textContent';
  var INNER_HTML = 'innerHTML';
  var SRC = 'src';
  var CONTENT = {
    title: ['title', TEXT_CONTENT],
    address: ['text--address', TEXT_CONTENT],
    price: ['text--price', TEXT_CONTENT],
    type: ['type', TEXT_CONTENT],
    capacity: ['text--capacity', TEXT_CONTENT],
    time: ['text--time', TEXT_CONTENT],
    features: ['features', INNER_HTML],
    description: ['description', TEXT_CONTENT],
    photos: ['photos', INNER_HTML],
    avatar: ['avatar', SRC]
  };

  var CONTENT_KEYS = Object.keys(CONTENT);

  var SELECTORS_DATA = {
    map: '.map',
    similarCardsTemplate: '#card',
    filters: '.map__filters-container'
  };

  var NODES = window.util.findNodes(SELECTORS_DATA);

  NODES.mapCard = NODES.similarCardsTemplate.content.querySelector('.map__card');

  var getFeature = function (item) {
    return '<li class="popup__feature popup__feature--' + item + '"></li>';
  };

  var getFeatures = function (arr) {
    if (!arr || arr.length === 0) {
      return [];
    }
    return arr.map(getFeature).join('');
  };

  var getPhoto = function (item) {
    return '<img src="' + item + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
  };

  var getPhotos = function (arr) {
    if (!arr || arr.length < 1) {
      return [];
    }
    return arr.map(getPhoto).join('');
  };

  var getCapacity = function (number) {
    var item = number;
    var roomDeclination = window.util.pluralize(item.rooms, ROOM_DECLINATION_VALUES);
    var guestDeclination = window.util.pluralize(item.guests, GUEST_DECLINATION_VALUES);
    return item.rooms + roomDeclination + ' для ' + item.guests + guestDeclination;
  };

  var getCardValues = function (cardData) {
    var item = cardData.offer;
    return {
      title: item.title,
      address: item.address,
      price: item.price + '₽/ночь',
      type: TYPES[item.type],
      capacity: getCapacity(item),
      time: 'Заезд после ' + item.checkin + ', выезд до ' + item.checkout,
      features: getFeatures(item.features),
      description: item.description,
      photos: getPhotos(item.photos),
      avatar: cardData.author.avatar
    };
  };

  var prepareCard = function (item) {
    var cardElement = NODES.mapCard.cloneNode(true);
    var values = getCardValues(item);

    CONTENT_KEYS.forEach(function (key) {
      var keyItem = CONTENT[key];
      if (!values[key]) {
        window['console']['error']('в values отсутствует ключ ' + key);
      } else {
        cardElement.querySelector('.popup__' + keyItem[0])[keyItem[1]] = values[key];
      }
    });
    return cardElement;
  };

  var renderCard = function (arr) {
    removeCard();
    NODES.map.insertBefore(prepareCard(arr), NODES.filters);
    NODES.map.querySelector('.popup__close').addEventListener('click', removeCard);
  };

  var removeCard = function () {
    var mapCard = NODES.map.querySelector('.map__card');
    if (mapCard) {
      mapCard.remove();
      window.pin.removeActive();
    }
  };

  var removeMapCardKeydownHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeCard();
    }
  };

  var addHandlers = function () {
    document.addEventListener('keydown', removeMapCardKeydownHandler);
  };

  window.card = {
    render: renderCard,
    remove: removeCard,
    nodes: NODES,
    addHandlers: addHandlers,
    escKeycode: ESC_KEYCODE,
    types: TYPES,
    getPhoto: getPhoto
  };
})();
