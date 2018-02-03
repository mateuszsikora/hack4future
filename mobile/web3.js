import { AsyncStorage } from 'react-native';
import Web3 from 'web3';

export const web3 = new Web3('https://rinkeby.infura.io');

let account;
AsyncStorage.getItem('privateKey', (err, v) => {
  if (!v || err) {
    account = web3.eth.accounts.create();
    AsyncStorage.setItem('privateKey', account.privateKey);
  } else {
    account = web3.eth.accounts.privateKeyToAccount(v);
  }
});

export function getAccount() {
  return account;
}
