const db = require('../firebase').database();

class Hold {

  constructor(id = '', uuid = '') {
    this.id = id;
    this.uuid = uuid;
  }

  static findByUUID(uuid){
    return db.ref('holds').once('value').then(snapshot => {
      const val = snapshot.val();
      if(val){
        return Object
          .keys(val)
          .filter(id=> val[id][uuid])
          .map(id=>new Hold(id, uuid))[0];
      }
    })
  }
}

module.exports = Hold;
