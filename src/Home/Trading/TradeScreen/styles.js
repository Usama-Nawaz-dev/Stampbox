import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from '../../../../assets/fonts/Fonts';

import colors from '../../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingHorizontal: wp(3)
    },
    titleStyle: {
        fontSize: 22,
        fontWeight: '600',
        left: 20,
        bottom: 5,
        color: colors.cBlack,
        textShadowColor: '#fff',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
        // textShadowRadius: 10,
    },
    detailsSection: {
        marginTop: hp(2.5),
        paddingHorizontal: wp(3)
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
        width: '50%',
        color: colors.cBlack
    },
    infoText: {
        fontWeight: '400',
        color: colors.lightText
    },
    expiryText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: hp(1),
        marginBottom: hp(1.5),
        color: colors.lightText,
        paddingHorizontal: wp(3)
    },
    idText: {
        textAlign: "center",
        marginTop: 5,
        marginBottom: 5,
        color: colors.theme,
        fontWeight: "500",
        fontSize: 14,
    },
    offerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(3)
    },
    offerText: {
        color: colors.btnText,
        fontWeight: '500',
        marginBottom: 5
    },
    offerText1: {
        color: colors.lightText,
        fontWeight: '400',
        marginBottom: 5
    },
    heading: {
        fontSize: 16,
        color: colors.lightBlack,
        fontWeight: '600',
        paddingHorizontal: wp(3),
        marginBottom: 5
    },
    userSection: {
        // backgroundColor:'red',
        paddingBottom: hp(2.5),
        borderBottomWidth: 1.2,
        borderColor: colors.borderColor,
        paddingHorizontal: wp(3)
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(1)
    },
    upperSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImg: {
        width: 45,
        height: 45,
        borderRadius: hp(10)
    },
    nameSection: {
        marginLeft: hp(1),
    },
    ownerText: {
        fontSize: 12,
        color: colors.lightText
    },
    flagBtn: {
        padding: hp(0.1),
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.lightText,
        borderRadius: hp(10)
    },
    lowerSection: {
        marginTop: hp(2),
        paddingHorizontal: wp(3),
    },
    itemHeading: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.cBlack,
        marginBottom: hp(1),
        fontFamily: Fonts.IBM_Regular
    },
    rowSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sortBySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: colors.borderColor,
        marginBottom: hp(1)
    },
    sortText: {
        fontSize: 12,
        fontFamily: Fonts.Inter_Medium,
        color: colors.btnText,
    }
})