const Bleacon = require('bleacon');

const MAX_ACCURACY = 1;

const beacons = new Set();

Bleacon.on('discover', (bleacon) => {
  if (bleacon.accuracy < MAX_ACCURACY) {
    beacons.add(bleacon);
  } else {
    beacons.delete(bleacon);
  }
  console.log(beacons);
});

Bleacon.startScanning();
