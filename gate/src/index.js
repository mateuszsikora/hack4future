const Bleacon = require('bleacon');
const Beacon = require('./models/beacons');
const Product = require('./models/product');
const Hold = require('./models/holds');
const Device = require('./models/devices');
const Order = require('./models/orders');
const eth = require('./eth');

const _ = require('lodash');

const MAX_ACCURACY = 1;

const holds = new Set();

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

const doPayments = _.debounce(
  () => {
    console.log("payments start!")
    const bcWithHoldPromises = Array.from(holds).map(h => {
      console.log('hold', h)
      return Device.findById(h.id).then((d) => [h, d])
    })
    const bcWithHold = Promise.all(bcWithHoldPromises).then(dt => {
      console.log(dt);
      return dt.reduce((agg, [b, d]) => {
        console.log(b, d)
        agg[d.account] = agg[d.account] || []
        agg[d.account].push(b)
        return agg
      }, {})
    }).then(receiptData => {
      console.log("To pay: ", JSON.stringify(receiptData, null, 2))
      const d = Object.entries(receiptData).map(([account, data]) => {
        return calculatePrice(data).then((o) => ({...o, account}));
      })

      return Promise.all(d).then((t) => {
        Promise.all(
          t.map(({account, products, amount}) => {
            const o = new Order(account, products);
            return o.save().then(oo => {
              console.log(account, o.id, amount);
              eth.sell(account, o.id, amount + "");
            })
          }))

      })
    })
  }, 1000)

Bleacon.on('discover', (bleacon) => {
  if (bleacon.accuracy < MAX_ACCURACY) {
    Hold.findByUUID(bleacon.uuid).then(h => {
      if (h) {
        holds.add(h);
        doPayments();
      }
    });
  }
  calculatePrice(beacons).then(({amount}) => console.log(amount))
});

Bleacon.startScanning();
