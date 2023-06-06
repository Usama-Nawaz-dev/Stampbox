import React from 'react'
import {
    StyleSheet, Text, Image,
    TouchableOpacity, View, Platform
} from "react-native";

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
// import images from '../../assets/images/Images'
import { images } from '../../assets/images/Images'

import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../constant/colors';
import Fonts from '../../assets/fonts/Fonts';

export const NotificationComp = (props) => {
    const { title, body, show, onPress } = props;
    return (
        show ? <View style={styles.container}>
            <TouchableOpacity style={styles.crossIcon} onPress={onPress}>
                <AntDesign name="close" size={22} />
            </TouchableOpacity>
            <Image
                style={styles.tinyLogo}
                source={images.LogoDark}
            />
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.body} numberOfLines={2}>{body}</Text>
            </View>
        </View> : null
    )
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Platform.OS == 'ios' ? hp(4) : hp(0),
        marginHorizontal: wp(3),
        width: wp(94),
        position: 'absolute',
        zIndex: 999,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        padding: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    crossIcon: {
        position: 'absolute',
        top: 7,
        right: 7
    },
    tinyLogo: {
        height: 50,
        width: 50,
        borderRadius: 10,
        marginLeft: hp(0.5),
        marginRight: hp(1.5),
        marginTop: 15
    },
    title: {
        color: colors.cBlack,
        fontFamily: Fonts.IBM_SemiBold,
    },
    body: {
        marginTop: 3,
        maxWidth: wp(72),
        color: colors.lightText,
        fontFamily: Fonts.IBM_Regular
    }
})