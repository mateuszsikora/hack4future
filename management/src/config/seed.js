const db = require('../firebase').database();

const Product = require('../models/product');
const Beacon = require('../models/beacons');

const products = [{
  name: 'Apple iPhone 8',
  description: 'iPhone 8 introduces an all‑new glass design. The world’s most popular camera, now even better. The most powerful and smartest chip ever in a smartphone. Wireless charging that’s truly effortless. And augmented reality experiences never before possible. iPhone 8. A new generation of iPhone.',
  price: '0.1',
  imageUrl: 'https://store.storeimages.cdn-apple.com/4662/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone8/plus/iphone8-plus-spgray-select-2017?wid=1200&hei=630&fmt=jpeg&qlt=95&op_sharpen=0&resMode=bicub&op_usm=0.5,0.5,0,0&iccEmbed=0&layer=comp&.v=1504041012436'
}, {
  name: 'Samsung Galaxy S8',
  description: 'The revolutionary design of the Galaxy S8 and S8+ begins from the inside out. We rethought every part of the phone\'s layout to break through the confines of the smartphone screen. So all you see is pure content and virtually no bezel. It\'s the biggest, most immersive screen on a Galaxy smartphone of this size. And it\'s easy to hold in one hand.',
  price: '0.07',
  imageUrl: 'https://drop.ndtv.com/TECH/product_database/images/329201783846PM_635_samsung_galaxy_s8.jpeg'
}, {
  name: 'Xiaomi Mi6',
  description: 'The Mi 6 is a performance beast powered by the lightning-fast Snapdragon 835 and a startling 6GB RAM. \n' +
  'The four-sided curved glass body and stainless steel frame house a gorgeous 5.15" display. \n' +
  'The state-of-the-art dual camera features optical zoom that supports effortless yet beautiful portrait shots.',
  price: '0.05',
  imageUrl: 'https://gsm.magazyn.pl/pic/b/xiaomi-mi6.jpg'
}, {
  name: 'OnePlus 5T',
  description: 'Optimized for low-light and portrait photography. Our highly rated 16 + 20 MP cameras help you capture crystal-clear shots.',
  price: '0.06',
  imageUrl: 'https://cdn2.gsmarena.com/vv/pics/oneplus/oneplus-5t-1.jpg'
}];


const beacons = [
  'e2c56db5dffb48d2b060d0f5a71096e0',
  '74278bdab64445208f0c720eaf059935',
  '11223353326c4423bb896587aaeeee07',
  '11223353326c4423bb896587aaeeef07'
];

function dropCollection(collection) {
  db.ref(collection).remove();
}

module.exports = function () {
  dropCollection('products');
  dropCollection('beacons');
  const savedProducts = products.map(product => Product.create(product));
  savedProducts.forEach((product, index) => {
    const beacon = {
      uuid: beacons[index % beacons.length],
      productId: product.id
    };
    Beacon.create(beacon);
  })
};
