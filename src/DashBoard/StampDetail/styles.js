import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from '../../../assets/fonts/Fonts';

import colors from '../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    edit: {
        padding: hp(1),
        borderRadius: hp(10),
        backgroundColor: `${colors.cWhite}20`
    },
    stampText: {
        fontSize: 18,
        fontWeight: '500',
        paddingTop: hp(1),
        // color: colors.lightBlack,
        paddingHorizontal: wp(2),
    },
    infoSection: {
        marginTop: hp(0.5),
        paddingHorizontal: wp(3),
    },
    priceSection: {
        paddingTop: hp(2),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    priceText: {
        fontSize: 16,
        fontWeight: '500',
        // color: colors.lightBlack,
    },
    counter: {
        position: 'absolute',
        right: 0,
        top: 0,
        borderRadius: hp(10),
        backgroundColor: colors.color8
    },
    counterText: {
        fontSize: 10,
        paddingHorizontal: 3,
        color: colors.cWhite
    },
    btnSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(3)
    },
    button: {
        marginTop: hp(1.5),
    },
    commentText: {
        alignSelf: 'flex-end',
        marginTop: hp(1.5),
        paddingHorizontal: wp(3),
    },
    comment: {
        // color: colors.btnText,
        textDecorationLine: 'underline'
    },
    emptyList: {
        fontSize: 12,
        fontWeight: '500',
        alignSelf: 'center',
        color: colors.color8,
        marginBottom: hp(0.5)
    },
    subHeading: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: hp(0.5),
        // color: colors.lightBlack,
    },
    labelStyle: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: "center",
        textTransform: "none",
        fontFamily: Fonts.IBM_Regular,
    },

    // Info ItemStyles
    rowSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    keyText: {
        width: '35%',
        fontSize: 14,
        // color: colors.lightBlack
    },
    valueText: {
        fontSize: 14,
        maxWidth: wp(62),
        // color: colors.lightText
    }
})