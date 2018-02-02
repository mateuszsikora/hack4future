import React from 'react';
import { StyleSheet, Text, View, DeviceEventEmitter } from 'react-native';

import Beacons from 'react-native-beacons-manager'


// Tells the library to detect iBeacons
Beacons.detectIBeacons()



// Start detecting all iBeacons in the nearby

Beacons.startRangingBeaconsInRegion('REGION1').then(console.log, console.error)

export default class App extends React.Component {
    state = {}
  componentDidMount(){
  DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
    console.log('Found beacons!', data.beacons)
    this.setState({x: data.beacons});
  })

  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start dupa 123 working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Text>{JSON.stringify(this.state.x)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
