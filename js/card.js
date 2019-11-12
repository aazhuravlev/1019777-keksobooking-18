'use strict';

(function () {
  var AccomodationType = {PALACE: 'Дворец', FLAT: 'Квартира', HOUSE: 'Дом', BUNGALO: 'Бунгало'};
  var ROOM_DECLINATION_VALUES = [' комната', ' комнаты', ' комнат'];
  var GUEST_DECLINATION_VALUES = [' гостя', ' гостей', ' гостей'];
  var ESC_KEYCODE = 27;

  var TEXT_CONTENT = 'textContent';
  var INNER_HTML = 'innerHTML';
  var SRC = 'src';
  var Content = {
    TITLE: ['title', TEXT_CONTENT],
    ADDRESS: ['text--address', TEXT_CONTENT],
    PRICE: ['text--price', TEXT_CONTENT],
    TYPE: ['type', TEXT_CONTENT],
    CAPACITY: ['text--capacity', TEXT_CONTENT],
    TIME: ['text--time', TEXT_CONTENT],
    FEATURES: ['features', INNER_HTML],
    DESCRIPTION: ['description', TEXT_CONTENT],
    PHOTOS: ['photos', INNER_HTML],
    AVATAR: ['avatar', SRC]
  };

  var CONTENT_KEYS = Object.keys(Content);

  var SelectorsData = {
    MAP: '.map',
    SIMILAR_CARDS_TEMPLATE: '#card',
    FILTERS: '.map__filters-container'
  };

  var Nodes = window.util.findNodes(SelectorsData);

  Nodes.MAP_CARD_TEMPLATE = Nodes.SIMILAR_CARDS_TEMPLATE.content.querySelector('.map__card');

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
      type: AccomodationType[item.type.toUpperCase()],
      capacity: getCapacity(item),
      time: 'Заезд после ' + item.checkin + ', выезд до ' + item.checkout,
      features: getFeatures(item.features),
      description: item.description,
      photos: getPhotos(item.photos),
      avatar: cardData.author.avatar
    };
  };

  var prepareCard = function (item) {
    var cardElement = Nodes.MAP_CARD_TEMPLATE.cloneNode(true);
    var values = getCardValues(item);
    CONTENT_KEYS.forEach(function (key) {
      var keyItem = Content[key];
      if (!values[key.toLowerCase()]) {
        window['console']['error']('в values отсутствует ключ ' + key);
      } else {
        cardElement.querySelector('.popup__' + keyItem[0])[keyItem[1]] = values[key.toLowerCase()];
      }
    });
    return cardElement;
  };

  var renderCard = function (arr) {
    removeCardHandler();
    Nodes.MAP.insertBefore(prepareCard(arr), Nodes.FILTERS);
    Nodes.MAP.querySelector('.popup__close').addEventListener('click', removeCardHandler);
    document.addEventListener('keydown', removeMapCardKeydownHandler);
  };

  var removeCardHandler = function () {
    var renderedMapCard = Nodes.MAP.querySelector('.map__card');
    if (renderedMapCard) {
      document.removeEventListener('keydown', removeMapCardKeydownHandler);
      Nodes.MAP.querySelector('.popup__close').removeEventListener('click', removeCardHandler);
      renderedMapCard.remove();
      window.pin.removeActive();
    }
  };

  var removeMapCardKeydownHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeCardHandler();
    }
  };

  window.card = {
    render: renderCard,
    removeHandler: removeCardHandler,
    nodes: Nodes,
    escKeycode: ESC_KEYCODE,
    accomodationType: AccomodationType,
    getPhoto: getPhoto
  };
})();
