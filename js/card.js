'use strict';

(function () {
  var ROOM_DECLINATION_VALUES = [' комната', ' комнаты', ' комнат'];
  var GUEST_DECLINATION_VALUES = [' гостя', ' гостей', ' гостей'];
  var ESC_KEYCODE = 27;

  var TEXT_CONTENT = 'textContent';
  var INNER_HTML = 'innerHTML';
  var SRC = 'src';
  var CONTENT = {
    title: ['title', TEXT_CONTENT],
    adress: ['text--address', TEXT_CONTENT],
    price: ['text--price', TEXT_CONTENT],
    type: ['type', TEXT_CONTENT],
    capacity: ['text--capacity', TEXT_CONTENT],
    time: ['text--time', TEXT_CONTENT],
    features: ['features', INNER_HTML],
    description: ['description', TEXT_CONTENT],
    photos: ['photos', INNER_HTML],
    avatar: ['avatar', SRC]
  };

  var SELECTORS_DATA = {
    map: '.map',
    similarCardsTemplate: '#card'
  };

  var NODES = window.util.findNodes(SELECTORS_DATA);

  NODES.mapCard = NODES.similarCardsTemplate.content.querySelector('.map__card');

  var CONTENT_KEYS = Object.keys(CONTENT);

  var getFeature = function (item) {
    return '<li class="popup__feature popup__feature--' + item + '"></li>';
  };

  var getFeatures = function (arr) {
    return arr.map(getFeature).join('');
  };

  var getPhoto = function (item) {
    return '<img src="' + item + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
  };

  var getPhotos = function (arr) {
    return arr.map(getPhoto).join('');
  };

  var getCapacity = function (number) {
    var item = number.offer;
    var roomDeclination = window.util.pluralize(item.rooms, ROOM_DECLINATION_VALUES);
    var guestDeclination = window.util.pluralize(item.guests, GUEST_DECLINATION_VALUES);
    return item.rooms + roomDeclination + ' для ' + item.guests + guestDeclination;
  };

  var getCardValues = function (cardData) {
    var item = cardData.offer;
    return {
      title: item.title,
      adress: item.adress,
      price: item.price + '₽/ночь',
      type: window.data.types[item.type],
      capacity: getCapacity(cardData),
      time: 'Заезд после ' + item.checkin + ', выезд до ' + item.checkout,
      features: getFeatures(item.features),
      description: item.description,
      photos: getPhotos(window.data.photos),
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

  var removeCard = function () {
    var mapCard = NODES.map.querySelector('.map__card');
    if (mapCard) {
      mapCard.remove();
    }
  };

  var removeMapCardKeydownHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeCard();
    }
  };

  var addHendlers = function () {
    NODES.map.addEventListener('keydown', removeMapCardKeydownHandler);
  };

  window.card = {
    prepare: prepareCard,
    remove: removeCard,
    removeKeydownHandler: removeMapCardKeydownHandler,
    nodes: NODES,
    addHendlers: addHendlers
  };
})();