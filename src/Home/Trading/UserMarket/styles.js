import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Fonts from '../../../../assets/fonts/Fonts';
import colors from '../../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.cWhite,
        flex: 1
    },
    itemSection: {
        marginTop: hp(2),
        paddingHorizontal: wp(3),
    },
    bottomBtn: {
        width:'100%',
        position: 'absolute',
        bottom: hp(2.5)
    },
    heading: {
        fontFamily: 'IBMPlexSans-Bold',
        // color: colors.lightBlack,
        fontSize: 20,
    },
    lowerSection: {
        // paddingVertical: hp(1.5),
    },
    inActiveText: {
        color: colors.theme,
        textAlign: 'center',
        fontSize: 15,
        marginTop: 5
    },
})