import { StyleSheet } from 'react-native'

import colors from '../../../constant/colors'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    container: {
        width: wp(100),
        backgroundColor: colors.cWhite,
    },
    topSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingHorizontal: wp(3),
        paddingVertical: 15
    },
    buttonSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    topBtn: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: colors.btnText,
    },
    infoSection: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    title: {
        fontSize: 22,
        color: colors.heading,
        fontFamily: 'IBMPlexSans-Bold'
    },
    info: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: colors.btnText,
        marginTop: 5,
        letterSpacing: 0.5,
    },
})