import React from 'react'
import {
    Text, Pressable, Image,
    StyleSheet, TouchableOpacity
} from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import LinearGradient from "react-native-linear-gradient";

import colors from '../constant/colors';
import Fonts from '../assets/fonts/Fonts';

const ShortcutTab = (props) => {
    const { image, onPress, title } = props;
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image style={{ width: 36, height: 36 }}
                source={image} resizeMode='contain' />
            <Text style={styles.titleText}>{title ? title : "My Album"}</Text>
        </TouchableOpacity>
    )
}

export default ShortcutTab;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        width: 92
    },
    gradStyle: {
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
        fontFamily: Fonts.Inter_Medium,
        color: '#373737'
    }
})