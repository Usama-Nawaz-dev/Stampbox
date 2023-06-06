
import { StyleSheet, Dimensions } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";


const { height, width } = Dimensions.get('window');

import colors from '../../../../constant/colors'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingHorizontal: wp(3)
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        // color: colors.heading
    },
    userSection: {
        marginTop: hp(1),
    },
    sellerText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: hp(1),
        // color: colors.heading
    },
    description: {
        marginTop: hp(1),
        // color: colors.lightText,
        maxWidth: wp(90)
    },
    locationText: {
        marginTop: hp(1),
        fontWeight: '500',
        // color: colors.heading
    },
    infoText: {
        fontWeight: '400',
        color: colors.lightText
    },
    text: {
        marginTop: 3,
        fontWeight: '500',
        // color: colors.heading
    }
})