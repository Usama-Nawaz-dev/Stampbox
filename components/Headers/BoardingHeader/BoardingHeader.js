import React, { useContext } from 'react'
import { Text, View, Pressable, TouchableOpacity } from 'react-native'

import { styles } from './styles'
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import colors from '../../../constant/colors';
import ThemeContext from '../../../src/Context/ThemeContext';

export const BoardingHeader = (props) => {
    const { onPressBack, onPressNext, title, btnRight } = props;
    const { theme }= useContext(ThemeContext);
    return (
        <View style={[styles.container, { backgroundColor: theme?.white}]}>
            <View style={styles.topSection}>
                <TouchableOpacity style={styles.buttonSection}
                    onPress={onPressBack}>
                    {onPressBack && <MaterialIcons name="chevron-left" size={22}
                        color={theme?.lightText} />}
                    {onPressBack && <Text style={[styles.topBtn, { color: theme?.lightText}]}>BACK</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSection}
                    onPress={onPressNext}>
                    <Text style={[styles.topBtn, { color: theme?.lightText}]}>{btnRight ? btnRight : "NEXT"}</Text>
                    <MaterialIcons name="chevron-right" size={22} color={theme?.lightText} />
                </TouchableOpacity>
            </View>
            <View style={styles.infoSection}>
                <Text style={[styles.title, { color: theme?.darkGrey}]}>Select {title} of Interest</Text>
                <Text style={[styles.info, {color: theme?.lightText}]}>You’ll get updates according to your selection.</Text>
            </View>
        </View>
    )
}
