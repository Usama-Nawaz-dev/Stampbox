import React, { useContext } from 'react'
import { Text, TouchableOpacity, Image, StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import LinearGradient from "react-native-linear-gradient";

import colors from '../../constant/colors';
import Fonts from '../../assets/fonts/Fonts';
import ThemeContext from '../../src/Context/ThemeContext';

export const GradTab = (props) => {
    const { image, onPress, color, title, size = hp(9), iconSize = hp(4.5) } = props;
    const { theme }= useContext(ThemeContext);
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <LinearGradient
                colors={color ? color : ["#BA4D3E", "#D27163"]}
                useAngle={true}
                angle={45}
                style={[styles.gradStyle, { height: size, width: size, }]}
            >
                <Image style={{ width: 32, height: 32, tintColor: colors.cWhite }}
                    source={image} resizeMode='contain' />
            </LinearGradient>
            <Text style={[styles.titleText, { color: theme?.lightText}]}>{title ? title : "My Album"}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    gradStyle: {
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        fontSize: 12,
        marginTop: hp(0.5),
        color: colors.lightText,
        fontFamily: Fonts.IBM_Medium,
    }
})