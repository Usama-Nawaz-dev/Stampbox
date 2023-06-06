import { StyleSheet } from 'react-native'

import colors from '../../../constant/colors'
import Fonts from '../../../assets/fonts/Fonts'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    card: {
        // backgroundColor: colors.cWhite,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        borderRadius: 5,
    },
    header: {
        flexDirection: 'row',
        height: 55,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(3),
    },
    userIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    heading: {
        fontSize: 16,
        fontFamily: Fonts.IBM_Medium,
        marginLeft: wp(3),
        color: colors.lightBlack
    },
    infoSection: {
        paddingHorizontal: wp(3)
    },
    about: {
        fontSize: 16,
        fontFamily: Fonts.IBM_Medium,
        // color: colors.lightBlack
    },
    aboutDetail: {
        fontSize: 12,
        color: colors.lightText,
        marginTop: 10
    },
    detailSection: {
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: colors.borderColor,
        paddingTop: 20
    },
    userDetail: {
        flexDirection: 'row',
        marginTop: 10
    },
    infoText: {
        fontSize: 13,
        // color: colors.lightText,
        marginBottom: 5,
    },
    infoText1: {
        fontSize: 13,
        // color: colors.lightText,
        marginBottom: 5,
        fontFamily: Fonts.IBM_Regular,
        fontWeight: '500'
    },
    emptyList: {
        fontSize: 13, 
        marginTop: 10, 
        textAlign: 'center',
        color: colors.theme,
        fontWeight: '500'
    },
    list: {
        flexDirection: 'row', 
        flexWrap: 'wrap'
    }
})