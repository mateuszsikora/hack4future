import React from 'react';
import {Text} from 'react-native';
import {Content} from 'native-base';

import DeviceInfo from 'react-native-device-info';

export default class Pay extends React.Component {

  render() {
    return (
      <Content>
        <Text>Pay</Text>
        <Text>Device ID: {DeviceInfo.getUniqueID()}</Text>
      </Content>
    );
  }
}
