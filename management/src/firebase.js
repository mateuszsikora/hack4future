const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

const config = require('./config/config');

module.exports = firebase.initializeApp(config.firebase);
