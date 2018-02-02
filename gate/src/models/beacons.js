const db = require('../firebase').database();

class Beacon {

  constructor(uuid, productId) {
    this.uuid = uuid;
    this.productId = productId;
  }

  save() {
    db.ref(`beacons/${this.uuid}`).set({...this});
  }

  static create(rawBeacon) {
    const beacon = Beacon.from(rawBeacon);
    beacon.save();
    return beacon;
  }

  static from({uuid, productId}) {
    return new Beacon(uuid, productId);
  }

  static findById(id) {
    return db.ref(`beacons/${id}`).once('value').then(snapshot => {
      const val = snapshot.val();
      if (val) {
        const {uuid, productId} = val;
        return new Beacon(uuid, productId);
      }
    });
  }
}

module.exports = Beacon;
