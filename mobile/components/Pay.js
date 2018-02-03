import React from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import {Header, Content, Title, Container, Body} from 'native-base';
import firebase from 'react-native-firebase';

import DeviceInfo from 'react-native-device-info';

import {abi, address as contractAddress} from '../contract';
import {web3, getAccount} from '../web3';

const db = firebase.database();

export default class Pay extends React.Component {
  state = {
    balance: 0,
    allowance: 0,
    toDeposit: '',
    toWithdraw: '',
    address: '',
  };

  componentDidMount() {
    this.contract = new web3.eth.Contract(abi, contractAddress);
    const account = getAccount();
    console.log('Your eth address', account.address);
    this.setState({address: account.address});
    this.observeAccount();

    db.ref(`devices/${DeviceInfo.getUniqueID()}`).set(account.address);
  }

  render() {
    const {balance, allowance, toDeposit, toWithdraw, address} = this.state;
    return (
      <Container>
        <Header>
          <Body>
          <Title>Wallet</Title>
          </Body>
        </Header>
        <View style={style.content}>
          <Text style={style.text}>
            Your eth address: <Text style={style.address}>{address}</Text>
          </Text>
          <View>
            <Text style={style.text}>
              Wallet balance: <Text style={style.bold}>{balance}</Text> ETH
            </Text>
            <TextInput
              placeholder="Amount to deposit"
              keyboardType="numeric"
              value={toDeposit}
              onChangeText={toDeposit => this.setState({toDeposit})}
            />
            <Button title="Deposit funds" onPress={this.deposit}/>
          </View>
          <View>
            <Text style={style.text}>
              Allowance for: <Text style={style.bold}>{allowance}</Text> ETH
            </Text>
            <TextInput
              placeholder="Amount to withdraw"
              keyboardType="numeric"
              value={toWithdraw}
              onChangeText={toWithdraw => this.setState({toWithdraw})}
            />
            <Button title="Withdraw funds" onPress={this.withdraw}/>
          </View>
        </View>
      </Container>
    );
  }

  observeAccount = async () => {
    const account = getAccount();
    const balance = await web3.eth.getBalance(account.address);
    this.setState({balance: web3.utils.fromWei(balance)});
    const allowance = await this.contract.methods
      .balanceOf(account.address)
      .call();
    this.setState({allowance: web3.utils.fromWei(allowance)});

    setTimeout(this.observeAccount, 5 * 1000);
  };

  deposit = () => {
    const value = web3.utils.toWei(this.state.toDeposit);
    const encodedAbi = this.contract.methods.deposit().encodeABI();
    const account = getAccount();
    account
      .signTransaction({
        value,
        to: contractAddress,
        gasPrice: '0x4e3b29200',
        gasLimit: '0x6baa8',
        data: encodedAbi,
      })
      .then(signedTx => {
        const transaction = web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
        );
        transaction.on('transactionHash', hash => {
          console.log(hash);
          this.setState({toDeposit: ''});
          ToastAndroid.show(
            'Transaction sent successfully',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
          );
        });
        transaction.then(() => {
          ToastAndroid.show(
            'Deposit successful',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
          );
        });
      });
  };

  withdraw = () => {
    const value = web3.utils.toWei(this.state.toWithdraw);
    const encodedAbi = this.contract.methods.withdraw(value).encodeABI();
    const account = getAccount();
    account
      .signTransaction({
        to: contractAddress,
        gasPrice: '0x4e3b29200',
        gasLimit: '0x6baa8',
        data: encodedAbi,
      })
      .then(signedTx => {
        const transaction = web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
        );
        transaction.on('transactionHash', hash => {
          console.log(hash);
          this.setState({toWithdraw: ''});
          ToastAndroid.show(
            'Transaction sent successfully',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
          );
        });
        transaction.then(() => {
          ToastAndroid.show(
            'Withdraw successful',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
          );
        });
      });
  };
}

const style = StyleSheet.create({
  text: {
    fontSize: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  address: {
    fontSize: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
  },
});
