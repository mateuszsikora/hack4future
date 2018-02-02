const Bleacon = require('bleacon');
const Beacon = require('./models/beacons');
const Product = require('./models/product');

const MAX_ACCURACY = 1;

const beacons = new Set();

function calculatePrice(beaconsSet) {
  const beaconsArray = Array.from(beaconsSet);
  const beaconsPromises = beaconsArray.map(beacon => Beacon.findById(beacon.uuid));
  return Promise.all(beaconsPromises)
    .then(beacons => Promise.all(beacons.map(beacon => Product.findById(beacon.productId))))
    .then(products => ({
      products,
      amount: products.reduce((sum, item) => sum + item.price, 0)
    }));
}

Bleacon.on('discover', (bleacon) => {
  if (bleacon.accuracy < MAX_ACCURACY) {
    beacons.add(bleacon);
  } else {
    beacons.delete(bleacon);
  }
  calculatePrice(beacons).then(({amount}) => console.log(amount))
});

Bleacon.startScanning();
