import React from 'react';
import { StyleSheet, Text, View, DeviceEventEmitter } from 'react-native';

import Beacons from 'react-native-beacons-manager'
import firebase from 'react-native-firebase';


// Tells the library to detect iBeacons
Beacons.detectIBeacons()
Beacons.setForegroundScanPeriod(5000)
Beacons.setBackgroundScanPeriod(5000)
Beacons.setBackgroundBetweenScanPeriod(100)

//const id = "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0"
const db = firebase.database();

// Start detecting all iBeacons in the nearby
export default class App extends React.Component {
    state = {x: {}}
  componentDidMount(){
       try {
            const granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Location Permission',
                    'message': 'Activeev needs to access your location.'
                }
            )
            console.log('here', granted);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Location Permitted")
            } else {
                console.log("Location permission denied")
            }
        } catch (err) {
            console.warn(err)
        }


        Beacons.startRangingBeaconsInRegion( "REGION1")
            .then((e)=>console.log("H4FDM succ"+ e), (e)=>console.error("H4FDM err"+e))
            .then(()=> {
                DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
                    console.log('Found beacons!', data.beacons)
                    const nw = data.beacons.map(b=>[`${b.uuid}:${b.major}:${b.minor}`, b])
                        .reduce((agg, v)=>{agg[v[0]]=v[1]; return agg}, {})

                    this.setState({x: {
                        ...this.state.x,
                        ...nw
                    }}
                );
                DeviceEventEmitter.addListener('regionDidEnter', (d)=>this.setState({y:d}))
                DeviceEventEmitter.addListener('regionDidExit', (d)=>this.setState({z:d}))
              })

              db.goOnline()

                db.ref(`products`).once('value')
                    .then(snapshot => {
                             const val = snapshot.val();
                             this.setState({z: val})
                           })
    })
  }

  componentWillUnmount() {
    Beacons.stopRangingBeaconsInRegion( "REGION1")
    db.goOffline()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start dupa 123 working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Text>x: {JSON.stringify(this.state.x, null, 2)}</Text>
        <Text>y: {JSON.stringify(this.state.y, null, 2  )}</Text>
        <Text>z: {JSON.stringify(this.state.z, null, 2)}</Text>
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
