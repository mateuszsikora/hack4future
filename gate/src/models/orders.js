const db = require('../firebase').database();

class Order {

  constructor(account='', products=[]) {
    this.account = account;
    this.products = products;
  }

  save() {
    if(!this.id) {
      this.id = db.ref().child('orders').push().key;
    }
    return db.ref(`orders/${this.id}`).set({...this});
  }
}

module.exports = Order;
