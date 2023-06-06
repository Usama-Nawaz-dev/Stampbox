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
        backgroundColor: colors.cWhite
    },
    itemSection: {
        marginTop: hp(2),
        paddingHorizontal: wp(3),
    },
    bottomBtn: {
        width: '100%',
        position: 'absolute',
        bottom: hp(2.5)
    },
    inActiveText: {
        color: colors.theme,
        textAlign: 'center',
        fontSize: 15,
        marginTop: hp(25)
    },

    tabSection: {
        marginTop: hp(1),
        paddingBottom: hp(0.5),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectedTab: {
        width: wp(30),
        borderRadius: 5,
        paddingVertical: 8,
        backgroundColor: colors.lightTheme,
    },
    defaultTab: {
        width: wp(30),
        borderRadius: 5,
        paddingVertical: 8,
        backgroundColor: colors.background,
    },
    tabText: {
        fontSize: 14,
        textAlign: 'center',
        color: colors.btnText,
        fontFamily: Fonts.IBM_Medium
    },
})