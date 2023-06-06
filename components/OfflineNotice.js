import React from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';



function OfflineNotice(props) {
  const netInfo = useNetInfo();

  if (netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No internet</Text>
      </View>
    );

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(252,92,101,0.8)',
    height: 50,
    alignSelf:'center',
    borderRadius:8,
    justifyContent: 'center',
    position: 'absolute',
    width: '92%',
    zIndex: 1,
    bottom: 100
  },
  text: {
    // paddingTop: Platform.OS === 'ios' ? 30 : 15,
    color: 'white',
  },
});

export default OfflineNotice;
