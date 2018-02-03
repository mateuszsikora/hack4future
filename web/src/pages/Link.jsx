import React, { Component } from 'react';
import Web3 from 'web3';
import { Button, Input } from 'semantic-ui-react';
import sigUtil from 'eth-sig-util';

import { signTypedData } from '../utils/web3';

import style from './link.scss';

export default class Link extends Component {
  web3 = new Web3();

  state = {
    deviceId: '',
  };

  componentWillMount() {
    if (window.web3) {
      this.web3.setProvider(window.web3.currentProvider);
    }
  }

  render() {
    const { deviceId } = this.state;

    return (
      <div className={style.self}>
        <Input
          placeholder="Device id"
          value={deviceId}
          onChange={e => this.setState({ deviceId: e.target.value })}
        />
        <Button onClick={this.linkDevice}>Link device</Button>
      </div>
    );
  }

  linkDevice = () => {
    this.signMessage()
      .then(() => {
        const address = this.props.history.replace('/wallet');
        // firebase set
      })
      .catch(e => console.log('error', e));
  };

  signMessage = async () => {
    const { deviceId } = this.state;
    const [address] = await this.web3.eth.getAccounts();
    const typedData = [
      {
        type: 'string',
        name: 'Message',
        value: `Prove you are the owner`,
      },
      {
        type: 'string',
        name: 'Device id',
        value: deviceId,
      },
    ];

    const signature = await signTypedData(this.web3, typedData, address);
    const recovered = sigUtil.recoverTypedSignature({
      data: typedData,
      sig: signature,
    });
    if (recovered.toLowerCase() === address.toLowerCase()) {
      return address;
    } else {
      throw Error(`Signature doesn't match`);
    }
  };
}
