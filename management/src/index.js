require('./firebase');
const seed = require('./config/seed');

const seedEnabled = true;

if (seedEnabled) {
  seed();
}
