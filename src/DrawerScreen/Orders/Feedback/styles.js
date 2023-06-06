import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen"

import colors from '../../../../constant/colors';
import Fonts from '../../../../assets/fonts/Fonts';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    section: {
        paddingTop: hp(2),
        paddingHorizontal: wp(3)
    },
    infoText: {
        fontSize: 13,
        marginTop: hp(2),
        marginBottom: hp(1),
        // color: colors.heading,
        fontFamily: Fonts.IBM_Medium
    },
    ratingStyle: {
        paddingVertical: 0,
        alignSelf: 'flex-start',
        marginLeft: wp(5),
    },
    input: {
        height: 110,
        padding: 10,
        borderRadius: 5,
        marginTop: hp(2),
        paddingTop: 12,
        color: colors.heading,
        fontFamily: Fonts.Inter_Regular,
        backgroundColor: colors.background,
    }
});