const db = require('../firebase').database();

const Product = require('../models/product');

const products = [{
  name: 'Apple',
  description: 'Fruit',
  price: '1',
  imageUrl: 'http://juliandance.org/wp-content/uploads/2016/01/RedApple.jpg'
}];

function dropCollection(collection) {
  db.ref(collection).remove();
}
module.exports = function() {
  dropCollection('products');
  products.forEach(product => Product.create(product));
};
