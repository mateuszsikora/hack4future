const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const SignerProvider = require('ethjs-provider-signer');

const { abi, address: contractAddress } = require('./contract');

const NETWORK_NAME = 'rinkeby';
const KEY = Buffer.from(
  'bb09c8f1c1484878dd6dddbbba653ade43b339702ed8a22f8dded9737b402a4d',
  'hex',
);
const ADDRESS = '0x3a64c6febb3d370b31f1f294028727300db7e1f9';

const provider = new SignerProvider(`https://${NETWORK_NAME}.infura.io`, {
  signTransaction: (rawTx, cb) => {
    console.log('Signing Transaction ✍🏻');
    const tx = new EthereumTx(rawTx);
    tx.sign(KEY);
    const serializedTx = tx.serialize();
    cb(null, `0x${serializedTx.toString('hex')}`);
  },
  accounts: cb => {
    cb(null, [ADDRESS]);
  },
});

const web3 = new Web3(provider);

web3.eth.getBalance(ADDRESS).then(balance => {
  console.log(`Account balance 💰 ${web3.utils.fromWei(balance)} ETH`);
});

const contract = new web3.eth.Contract(abi, contractAddress);

module.exports = {
  sell(whom, orderId, price) {
    return new Promise(resolve => {
      console.log('Selling stuff 🤑');
      const transaction = contract.methods
        .sell(whom, orderId, web3.utils.toWei(price))
        .send({
          from: ADDRESS,
          gasPrice: '0x4e3b29200',
          gasLimit: '0x6baa8',
        });

      transaction.on('transactionHash', hash => {
        console.log('transaction hash', hash);
        resolve(hash);
      });

      transaction.then(recepit => console.log('receipt', recepit));
    });
  },
};
