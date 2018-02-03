const Web3 = require('web3');
const firebase = require('firebase');

const { abi, address: contractAddress } = require('./contract');

const config = {
  apiKey: 'AIzaSyAZ6L8aptD2NFYVBRpzJIXN1yOKksvxrXo',
  authDomain: 'hack4future.firebaseapp.com',
  databaseURL: 'https://hack4future.firebaseio.com',
  projectId: 'hack4future',
  storageBucket: 'hack4future.appspot.com',
  messagingSenderId: '617857797454',
};
firebase.initializeApp(config);
const db = firebase.database();

const web3 = new Web3('wss://rinkeby.infura.io/ws');
const contract = new web3.eth.Contract(abi, contractAddress);

const sub = web3.eth.subscribe('newBlockHeaders');
sub.on('data', header => {
  console.log('new block', header.number);
});

const depositEvent = contract.events.Deposit();
depositEvent.on('data', data => {
  console.log('Deposit', data.returnValues);
});

const withdrawEvent = contract.events.Withdraw();
withdrawEvent.on('data', data => {
  console.log('Withdraw', data.returnValues);
});

const sellEvent = contract.events.Sell();
sellEvent.on('data', data => {
  console.log('Sell', data);
  db
    .ref(`transactions/${data.returnValues._buyer}/${data.transactionHash}`)
    .set({
      order: data.returnValues._orderId,
      price: data.returnValues._price,
    });
});
