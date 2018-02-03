import { AsyncStorage } from 'react-native';
import Web3 from 'web3';

let account;
AsyncStorage.getItem('privateKey', (err, v) => {
  const web3 = new Web3();
  if (!v || err) {
    account = web3.eth.accounts.create();
    AsyncStorage.setItem('privateKey', account.privateKey);
  } else {
    account = web3.eth.accounts.privateKeyToAccount(v);
  }
});
