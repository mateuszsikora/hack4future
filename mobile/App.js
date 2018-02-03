import React from 'react';
import { StyleSheet, Text, ScrollView, DeviceEventEmitter } from 'react-native';

import Beacons from 'react-native-beacons-manager'
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import {reduceBeaconsState, saveHolds} from './beacons';

// Tells the library to detect iBeacons
Beacons.detectIBeacons();
Beacons.setForegroundScanPeriod(5000);
Beacons.setBackgroundScanPeriod(5000);
Beacons.setBackgroundBetweenScanPeriod(100);

//const id = "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0"
const db = firebase.database();

// Start detecting all iBeacons in the nearby
export default class App extends React.Component {
  state = { beacons: {}, products: {} };

  componentDidMount() {
    try {
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location Permission',
          'message': 'Activeev needs to access your location.'
        }
      );
      console.log('here', granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location Permitted");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }


    Beacons.startRangingBeaconsInRegion("REGION1")
      .then((e) => console.log("H4FDM succ" + e), (e) => console.error("H4FDM err" + e))
      .then(() => {
        DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
          console.log('Found beacons!', data.beacons);
          const beacons =  reduceBeaconsState(this.state.beacons, data);
          this.setState({
            beacons: beacons
          });
          saveHolds(db, DeviceInfo.getUniqueID(), beacons);
        });

        db.goOnline();

        db.ref(`products`).once('value')
          .then(snapshot => {
            const val = snapshot.val();
            this.setState({ products: val });
          })
      })
  }

  componentWillUnmount() {
    Beacons.stopRangingBeaconsInRegion("REGION1");
    db.goOffline();
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text>App</Text>
        <Text>deviceId: {DeviceInfo.getUniqueID()}</Text>
        <Text>beacons: {JSON.stringify(this.state.beacons, null, 2)}</Text>
        <Text>products: {JSON.stringify(this.state.products, null, 2)}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
