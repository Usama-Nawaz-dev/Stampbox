import { StyleSheet, Dimensions } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite,
    },
    infoCard: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 1.8,
        borderRadius: 5,
        marginHorizontal: wp(3),
        padding: wp(2),
        marginVertical: hp(1.5)
    },
    stampName: {
        fontSize: 16,
        fontWeight: '500',
        // color: colors.cBlack,
    },
    text: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: hp(0.5),
        // color: colors.cBlack,
    },
    infoText: {
        fontWeight: '400',
        color: colors.lightText
    },
    bottomButton: {
        position: 'absolute',
        bottom: hp(3)
    },
    emptyList: {
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyText: {
        fontWeight: '500',
        color: colors.lightTheme
    },

    //Album Card
    mediaSection: {
        marginRight: wp(7),
        paddingTop: hp(1),
    },
    editStampCard: {
        width: wp(35),
        height: wp(35),
        borderColor: colors.theme,
        backgroundColor: colors.white,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        padding: 5
    },
    stampImg: {
        width: '100%',
        height: '100%',
        marginVertical: hp(0.3),
    },
    bottomButton: {
        position: 'absolute',
        bottom: hp(3)
    },
    itemText: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: hp(0.5),
        maxWidth: wp(37),
        color: colors.cBlack,
    },
});