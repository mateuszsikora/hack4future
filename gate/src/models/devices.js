const db = require('../firebase').database();

class Device {

  constructor(id = '', account = '') {
    this.id = id;
    this.account = account;
  }

  static findById(id){
    return db.ref(`devices/${id}`).once('value').then(snapshot => {
      const val = snapshot.val();
      if(val){
        return new Device(id, val)
      }
    })
  }
}

module.exports = Device;
