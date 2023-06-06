import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Fonts from '../../assets/fonts/Fonts';
import colors from '../../constant/colors';

export default function ErrorMessage({ error, visible }) {
  if (!visible || !error) return null;
  return <View style={styles.error}>
    <AntDesign name='infocirlce' color={colors.red} size={12} />
    <Text style={[styles.errorText, { color: colors.red }]}>{error}</Text>
  </View>;
}

const styles = StyleSheet.create({
  // error: { color: 'red', textAlign: 'right', bottom: 5, right: 10 },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    alignSelf: 'flex-end'
  },
  errorText: {
    fontSize: 12,
    marginLeft: 5,
    fontFamily: Fonts.Roboto_Regular
  },

});
