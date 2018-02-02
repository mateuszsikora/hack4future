const db = require('../firebase').database();

class Product {

  constructor(name = '', description = '', price = 0, imageUrl = '') {
    this.name = name;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  save() {
    if(!this.id) {
      this.id = db.ref().child('products').push().key;
    }
    const product = {...this};
    db.ref(`products/${this.id}`).set({...this});
  }

  static create({name, description, price, imageUrl}) {
    const product = new Product(name, description, price, imageUrl);
    product.save();
    return product;
  }
}

module.exports = Product;
