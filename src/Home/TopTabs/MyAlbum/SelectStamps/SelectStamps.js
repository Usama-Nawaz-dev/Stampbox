import React, { useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styles } from './styles';

import { MainHeader } from '../../../../../components';
import AppText from '../../../../../components/AppText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Helper from '../../../../Helper';
import colors from '../../../../../constant/colors';
import AuthContext from '../../../../Context/AuthContext';
import ThemeContext from '../../../../Context/ThemeContext';
// import { dark as theme } from '../../../../../constant/colorsConfig';

export const SelectStamps = ({ navigation }) => {
  const {myState:{language}}=useContext(AuthContext);
  const { theme, mood} = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader title="Select Stamps"
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.section}>
        <TouchableOpacity style={styles.button}
          onPress={() => navigation.replace("AddStamps", { item: false })}>
          <Ionicons name="md-images-outline" size={35} color={colors.lightBlack} />
          <AppText style={styles.text}>{language?.addStamp}</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
          onPress={() => Helper.showToastMessage("Coming Soon", colors.blueTheme)}>
          <MaterialCommunityIcons name="camera-outline" size={35} color={colors.lightBlack} />
          <AppText style={styles.text}>Scan New</AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}
