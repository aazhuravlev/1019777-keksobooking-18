'use strict';

var PINS_QUANTITY = 8;
var map = document.querySelector('.map');
map.classList.remove('map--faded');

var PINS = document.querySelector('.map__pins');

var SIMILAR_PINS_TEMPLATE = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var getPins = function (quantity) {
  var pinsDesc = [];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  for (var i = 0; i < quantity; i++) {
    pinsDesc.push({
      author: {
        avatar: 'img/avatars/user0' + [i + 1] + '.png',
      },
      offer: {
        title: 'заголовок предложения',
        adress: '600, 350',
        price: '1000',
        type: 'palace',
        rooms: '2',
        guests: '2',
        checkin: '12:00',
        checkout: '12:00',
        features: features,
        description: 'строка',
        photos: photos
      },
      location: {
        x: '150px',
        y: '130px'
      }
    });
  }
  return pinsDesc;
};

var renderPin = function (arr) {
  var pinElement = SIMILAR_PINS_TEMPLATE.cloneNode(true);

  for (var i = 0; i < arr.length; i++) {
    pinElement.style = 'left: ' + arr[i].location.x + 'top ' + arr[i].location.y;
    pinElement.querySelector('img').setAttribute('src', arr[i].author.avatar);
    pinElement.querySelector('img').setAttribute('alt', arr[i].offer.title);
  }
  return pinElement;
};

var getFragment = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderPin(arr[i]));
  }
  return fragment;
};

var DESC_PINS = getPins(PINS_QUANTITY);
PINS.appendChild(getFragment(DESC_PINS));
