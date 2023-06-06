import React, { useState, useEffect, useContext } from 'react'
import { View, TouchableOpacity, FlatList } from 'react-native'

import AppText from '../../../../components/AppText'
import colors from '../../../../constant/colors'

import ShippingCard from '../../../../components/ShippingCard'
import { useIsFocused } from '@react-navigation/native'

import { styles } from './styles'
import Helper from '../../../Helper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AuthContext from '../../../Context/AuthContext'
import ThemeContext from '../../../Context/ThemeContext'
// import { dark as theme } from '../../../../constant/colorsConfig'

const DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 17, 18, 19, 20, 2, 3, 4, 5, 5, 5, 5, 6, 6, 6, 7]
export const ShippingTab = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  const {myState: {language}}= useContext(AuthContext);
  const { theme }= useContext(ThemeContext);
  const focused = useIsFocused();
  useEffect(() => {
    if (focused) {
      Helper.showToastMessage("Coming Soon.", colors.blueTheme);
    }
  }, [focused])

  const renderItem = ({ item, index }) => {
    const isEnd = index === DATA.length - 1;
    return (
      <View style={{ marginBottom: 10, marginTop: index == 0 ? 5 : 0 }}>
        <ShippingCard onPress={() => props.navigation.navigate("InvoiceDetails")} />
      </View>
    )
  }
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <View style={styles.switchSection}>
        <TouchableOpacity style={!isSelected ? styles.selectedTab : styles.defaultTab}
          onPress={() => setIsSelected(false)}>
          <AppText style={[styles.tabText, isSelected && { color: colors.lightText }]}>{language?.COMPLETED}</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={isSelected ? styles.selectedTab : styles.defaultTab}
          onPress={() => setIsSelected(true)}>
          <AppText style={[styles.tabText, !isSelected && { color: colors.lightText }]}>{language?.PENDING}</AppText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={DATA}
        style={{ paddingHorizontal: wp(3), marginBottom: 10 }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={true}
      />
    </View>
  )
}

