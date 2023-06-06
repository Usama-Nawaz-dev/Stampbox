import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen"

import colors from '../../../constant/colors';
import Fonts from '../../../assets/fonts/Fonts';

export const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cWhite,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        borderRadius: 10,
        padding: wp(3),
        marginTop: hp(1),
        marginHorizontal: wp(3)
    },
    headerSection: {
        paddingBottom: hp(0.5),
        marginBottom: hp(0.5),
        borderBottomWidth: 1,
        borderColor: colors.borderColor
    },
    soldText: {
        fontSize: 12,
        marginTop: 3
    },
    ownerName: {
        color: colors.theme
    },
    topSection: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    rowSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    packageText: {
        fontSize: 16,
        marginLeft: wp(2),
        fontWeight: '500',
        // color: colors.heading,
        fontFamily: Fonts.IBM_Regular
    },
    stampImg: {
        height: 80,
        width: 80,
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: 10
    },
    userSection: {
        marginTop: 2,
        marginLeft: 10
    },
    nameText: {
        fontFamily: 'IBMPlexSans-Regular',
        fontSize: 16,
        fontWeight: '500',
        // color: colors.heading,
        maxWidth: wp(65)
    },
    infoText: {
        fontSize: 12,
        marginTop: 2,
        color: colors.lightText
    },
    detailText: {
        marginTop: 5,
        fontSize: 12,
        fontWeight: '500',
        // color: colors.lightBlack
    },
    addressText: {
        marginTop: 2,
        fontSize: 12,
        // color: colors.lightBlack
    },
    addressSection: {
        marginTop: hp(1),
        borderTopWidth: 1,
        borderColor: colors.borderColor
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: hp(0.5),
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(1),
        paddingTop: hp(0.5),
        borderTopWidth: 1,
        borderColor: colors.borderColor
    },
    priceText: {
        fontSize: 12,
        fontWeight: '500'
    },
    amountText: {
        fontSize: 12,
        color: colors.theme
    },

    orderSection: {
        flexDirection: 'row',
        paddingHorizontal: wp(3),
        marginTop: hp(1),
        paddingTop: hp(2),
        borderTopWidth: 1,
        borderColor: colors.borderColor
    },
    userImg: {
        height: 36,
        width: 36,
        borderRadius: 100
    },
    verticleLine: {
        height: 50,
        width: 1.5,
        backgroundColor: colors.borderColor,
        alignSelf: 'center',
        marginVertical: -5,
        zIndex: -10
    },
    verticleLine1: {
        height: 50,
        width: 1.5,
        backgroundColor: colors.green,
        alignSelf: 'center',
        marginVertical: -5,
        zIndex: -10
    },
    dotSection: {
        alignItems: 'center',
        width: 12,
    },
    iconSection: {
        marginTop: -10,
        marginLeft: wp(3),
        flexDirection: 'row'
    },
    iconStyle: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    heading: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 3
    },
    text: {
        fontSize: 10,
        color: colors.lightText
    }
});