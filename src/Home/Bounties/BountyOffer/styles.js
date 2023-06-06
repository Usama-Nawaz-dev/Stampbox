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
        backgroundColor: colors.cWhite,
    },
    stampImg: {
        width: '100%',
        height: 200,
        resizeMode: 'stretch'
    },
    infoSection: {
        paddingHorizontal: wp(3)
    },
    offer: {
        marginTop: 10,
        color: colors.lightText
    },
    choose: {
        fontWeight: '600',
        marginTop: 10,
        color: colors.theme
    },
    tabSection: {
        marginTop: hp(1),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectedTab: {
        backgroundColor: colors.lightTheme,
        paddingVertical: 10,
        paddingHorizontal: wp(7),
        borderRadius: 5,
        marginRight: wp(3)
    },
    defaultTab: {
        backgroundColor: colors.background,
        paddingVertical: 10,
        paddingHorizontal: wp(7),
        borderRadius: 5,
        marginRight: wp(3)
    },
    tabText: {
        fontSize: 12,
        color: colors.btnText,
    },
    itemSection: {
        height: 60,
        justifyContent: 'center',
        paddingHorizontal: wp(3),
        marginTop: 15,
        // backgroundColor: 'red'
    },
    addStampCard: {
        width: 80,
        height: 80,
        backgroundColor: colors.cWhite,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        marginTop: hp(1),
    },
    img: {
        height: 70,
        width: 70,
        alignSelf: 'center',
        resizeMode: 'cover'
    },
    input: {
        height: 45,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: colors.borderColor,
        fontFamily: Fonts.Inter_Regular
    },
    bottomButton: {
        alignItems: 'center'
    },
    cancelBtn: {
        marginVertical: 20
    },
    cancelText: {
        fontSize: 16,
        // color: colors.btnText
    }
})