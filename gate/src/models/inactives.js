const db = require('../firebase').database();

class Inactive {

  constructor(id) {
    this.id = id
  }

  save() {
    return db.ref(`inactive/${this.id}`).set(true);
  }

  static getAll(){
    return db.ref(`inactive`).once('value').then(snapshot => {
      return snapshot.val();
    })
  }

  static isActive(uuid){
    return db.ref(`inactive/${uuid}`).once('value').then(snapshot => {
      return !snapshot.val();
    })
  }
}

module.exports = Inactive;
