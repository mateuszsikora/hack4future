import React from 'react';
import { StyleSheet, Text, ScrollView, DeviceEventEmitter, AsyncStorage } from 'react-native';

import {NativeRouter, Route, Redirect, Switch, withRouter, AndroidBackButton} from 'react-router-native'
import Beacons from 'react-native-beacons-manager'
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import {reduceBeaconsState, saveHolds} from './beacons';
import {Container} from 'native-base';
import routes from './routes';
import Cart from './components/Cart';
import Pay from './components/Pay';
import commonStyles from './commonStyles';
import Web3 from 'web3';
import Footer from "./components/Footer";
// Tells the library to detect iBeacons
Beacons.detectIBeacons();
Beacons.setForegroundScanPeriod(5000);
Beacons.setBackgroundScanPeriod(5000);
Beacons.setBackgroundBetweenScanPeriod(100);
const db = firebase.database();
// Start detecting all iBeacons in the nearby

let account;
AsyncStorage.getItem("privateKey", (err,v)=> {
  const web3 = new Web3();
  if(!v || err) {
    account = web3.eth.accounts.create();
    AsyncStorage.setItem("privateKey", account.privateKey);
  }else{
    account = web3.eth.accounts.privateKeyToAccount(v);
  }
})

const FooterWithRouter = withRouter(Footer);
export default class App extends React.Component {
  state = { beacons: {}};

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
      })
  }

  componentWillUnmount() {
    Beacons.stopRangingBeaconsInRegion("REGION1");
    db.goOffline();
  }

  render() {
    return (
      <NativeRouter>
        <Container style={commonStyles.container}>
          <Text>{account && account.address + ""}</Text>
          <AndroidBackButton/>
          <Route exact path={routes.cart} render={(props) => <Cart {...props} holds={this.state.beacons} />} />
          <Route path={routes.pay} component={Pay}/>
          <FooterWithRouter />
        </Container>
      </NativeRouter>
    );
  }
}
