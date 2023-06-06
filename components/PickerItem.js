import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import AppText from './AppText';

export default function PickerItem({item, onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <AppText style={styles.text}>{item}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    padding: 10,
    fontSize: 18,
  },
});
