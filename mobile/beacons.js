const filterValid = (beacon) => {
  return  beacon.distance < 1
}

export const reduceBeaconsState = (state, data) => {
  const beacons = data.beacons.map(beacon => ({...beacon, uuid: beacon.uuid.replace(new RegExp('-', 'g'), '')}));

  const nw = beacons
  .filter(_ => _.distance < 1)
  .map(b => [b.uuid, {...b, timestamp: Date.now()}])
  .reduce((agg, [k, v])=> Object.assign(agg, {[k]: v}), {});

  const outside = beacons
    .filter(_=>_.distance >= 1).map(_ => _.uuid);

  const updatedState = Object.entries(state)
    .filter(_ => _.timestamp + 3000 >= Date.now() )
    .filter(_ => !outside.includes(_))
    .reduce((agg, [k, v])=> Object.assign(agg, {[k]: v}), {});

  return {
    ...updatedState,
    ...nw
  }
};

export const saveHolds = (db, deviceId, beaconsIds) => {
  db.ref(`holds/${deviceId}`).set({...beaconsIds});
}
