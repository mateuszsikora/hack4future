const db = require('../firebase').database();

const Product = require('../models/product');

const products = [{
  name: 'Apple iPhone 8',
  description: 'iPhone 8 introduces an all‑new glass design. The world’s most popular camera, now even better. The most powerful and smartest chip ever in a smartphone. Wireless charging that’s truly effortless. And augmented reality experiences never before possible. iPhone 8. A new generation of iPhone.',
  price: '2999',
  imageUrl: 'https://store.storeimages.cdn-apple.com/4662/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone8/plus/iphone8-plus-spgray-select-2017?wid=1200&hei=630&fmt=jpeg&qlt=95&op_sharpen=0&resMode=bicub&op_usm=0.5,0.5,0,0&iccEmbed=0&layer=comp&.v=1504041012436'
}, {
  name: 'Samsung Galaxy S8',
  description: 'The revolutionary design of the Galaxy S8 and S8+ begins from the inside out. We rethought every part of the phone\'s layout to break through the confines of the smartphone screen. So all you see is pure content and virtually no bezel. It\'s the biggest, most immersive screen on a Galaxy smartphone of this size. And it\'s easy to hold in one hand.',
  price: '2299',
  imageUrl: 'https://drop.ndtv.com/TECH/product_database/images/329201783846PM_635_samsung_galaxy_s8.jpeg'
}];

function dropCollection(collection) {
  db.ref(collection).remove();
}
module.exports = function() {
  dropCollection('products');
  products.forEach(product => Product.create(product));
};
