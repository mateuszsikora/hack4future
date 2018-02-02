const db = require('../firebase').database();

class Product {

  constructor(name = '', description = '', price = '0', imageUrl = '') {
    this.name = name;
    this.description = description;
    this.price = parseInt(price, 10);
    this.imageUrl = imageUrl;
  }

  save() {
    if(!this.id) {
      this.id = db.ref().child('products').push().key;
    }
    db.ref(`products/${this.id}`).set({...this});
  }

  static create(rawProduct) {
    const product = Product.from(rawProduct);
    product.save();
    return product;
  }

  static from({name, description, price, imageUrl}) {
    const product = new Product(name, description, price, imageUrl);
    return product;
  }

  static findById(id) {
    return db.ref(`products/${id}`).once('value').then(snapshot => {
      const val = snapshot.val();
      if (val) {
        return Product.from(val);
      }
    });
  }
}

module.exports = Product;
