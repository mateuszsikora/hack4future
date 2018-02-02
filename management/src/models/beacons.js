const db = require('../firebase').database();

class Beacon {

  constructor(uuid, productId) {
    this.uuid = uuid;
    this.productId = productId;
  }

  save() {
    db.ref(`beacons/${this.uuid}`).set({...this});
  }

  static create({uuid, productId}) {
    const beacon = new Beacon(uuid, productId);
    beacon.save();
    return beacon;
  }
}

module.exports = Beacon;
