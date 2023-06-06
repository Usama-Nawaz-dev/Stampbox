import React, { useState, useEffect, useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'

import { styles } from './styles'
import AppText from '../../../../components/AppText'
import Btn from '../../../../components/Btn'
import Helper from '../../../Helper'
import colors from '../../../../constant/colors'
import { useIsFocused } from '@react-navigation/native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AuthContext from '../../../Context/AuthContext'
import ThemeContext from '../../../Context/ThemeContext'
// import { dark as theme } from '../../../../constant/colorsConfig'

export const SellingTab = () => {
    const [isSelected, setIsSelected] = useState(false);
    const focused = useIsFocused();
    const{myState: {language}}=useContext(AuthContext);
    const { theme }= useContext(ThemeContext);
    useEffect(() => {
        if (focused) {
            Helper.showToastMessage("Coming Soon.", colors.blueTheme);
        }
    }, [focused])
    return (
        <View style={[styles.container, { backgroundColor: theme?.white}]}>
            <View style={styles.switchSection}>
                <TouchableOpacity style={!isSelected ? styles.selectedTab : styles.defaultTab}
                    onPress={() => setIsSelected(false)}>
                    <AppText style={[styles.tabText, isSelected && { color: theme?.lightText }]}>{language?.allStamps}</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={isSelected ? styles.selectedTab : styles.defaultTab}
                    onPress={() => setIsSelected(true)}>
                    <AppText style={[styles.tabText, !isSelected && { color: theme?.lightText }]}>{language?.allSupplies}</AppText>
                </TouchableOpacity>
            </View>
            {!isSelected ? <View style={styles.emptySection}>
                <AppText style={styles.addText}>You have no Item listed at this time</AppText>
                <Btn label="Add Item" fontSize={12} height={40} width={wp(36)}
                    style={styles.addText}
                    iconLeft={<SimpleLineIcons name='plus' size={22} color="#fff" style={{ marginRight: 5 }} />}
                />
            </View> : null
            }
        </View>
    )
}

