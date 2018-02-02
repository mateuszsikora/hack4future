import React, { Component } from 'react';
import Web3 from 'web3';
import { Button, Input } from 'semantic-ui-react';

import { abi, address as contractAddress } from '../../../eth/contract';

export default class Home extends Component {
  web3 = new Web3();
  state = {
    account: '',
    balance: 0,
    deposited: 0,
    toDeposit: 0,
    toWithdraw: 0,
    web3: false,
  };

  componentWillMount() {
    if (window.web3) {
      this.web3.setProvider(window.web3.currentProvider);
      this.contract = new this.web3.eth.Contract(abi, contractAddress);
      this.setState({ web3: true });
      this.observ();
    }
  }

  render() {
    const { web3, balance, deposited, toDeposit, toWithdraw } = this.state;

    if (!web3) {
      return (
        <a href="https://metamask.io">
          <h2>Install metamask</h2>
        </a>
      );
    }

    return (
      <div>
        <p>Available {balance} ETH in your wallet</p>
        <p>Deposited {deposited} ETH in the shop</p>
        <hr />
        <Input
          placeholder="Amount to deposit"
          value={toDeposit}
          onChange={e => this.setState({ toDeposit: e.target.value })}
        />
        <Button onClick={this.deposit}>Deposit</Button>
        <Input
          placeholder="Amount to withdraw"
          value={toWithdraw}
          onChange={e => this.setState({ toWithdraw: e.target.value })}
        />
        <Button onClick={this.withdraw}>Withdraw</Button>
      </div>
    );
  }

  observ = async () => {
    const web3 = this.web3;
    const contract = this.contract;
    const [account] = await web3.eth.getAccounts();
    this.setState({ account });
    const balance = await web3.eth.getBalance(account);
    this.setState({ balance: web3.utils.fromWei(balance) });
    const deposited = await contract.methods.balanceOf(account).call();
    this.setState({ deposited: web3.utils.fromWei(deposited) });
  };

  deposit = () => {
    const value = this.web3.utils.toWei(this.state.toDeposit);
    const transaction = this.contract.methods
      .deposit()
      .send({ value, from: this.state.account });

    transaction.on('transactionHash', tx => {
      console.log('Transaction hash', tx);
    });
  };

  withdraw = () => {
    const value = this.web3.utils.toWei(this.state.toWithdraw);
    const transaction = this.contract.methods
      .withdraw(value)
      .send({ from: this.state.account });

    transaction.on('transactionHash', tx => {
      console.log('Transaction hash', tx);
    });
  };
}
