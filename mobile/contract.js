// https://rinkeby.etherscan.io/address/0x83e5e11e3d9b9ac764e6bac139d9f437209cbb10

const address = '0x83e5e11e3d9b9ac764e6bac139d9f437209cbb10';

const abi = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_from',
        type: 'address',
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_buyer',
        type: 'address',
      },
      {
        indexed: false,
        name: '_orderId',
        type: 'string',
      },
      {
        indexed: false,
        name: '_price',
        type: 'uint256',
      },
    ],
    name: 'Sell',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_from',
        type: 'address',
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    constant: false,
    inputs: [],
    name: 'deposit',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'destroy',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_buyer',
        type: 'address',
      },
      {
        name: '_orderId',
        type: 'string',
      },
      {
        name: '_price',
        type: 'uint256',
      },
    ],
    name: 'sell',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
];

module.exports = {
  abi,
  address,
};
