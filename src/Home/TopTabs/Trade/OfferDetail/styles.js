import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: colors.cWhite,
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(2),
        paddingVertical: hp(2),
        paddingHorizontal: wp(6),
    },
    detailText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.theme,
    },
    activeText: {
        fontSize: 12,
        color: colors.green,
        marginTop: 5
    },
    commentIcon: {
        height: 24,
        width: 24,
        resizeMode: 'contain',
        tintColor: colors.lightText
    },
    infoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: wp(6),
    },
    commentSection: {
        borderRadius: 7,
        borderWidth: 1.5,
        padding: 4,
        borderColor: colors.borderColor
    },
    cardSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: wp(3),
    },
    nameText: {
        fontSize: 16,
        fontWeight: '500',
        // color: colors.lightBlack,
        maxWidth: wp(80)
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 10,
        // color: colors.lightBlack
    },
    offerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    card: {
        backgroundColor: colors.cWhite,
        height: 100,
        width: wp(24),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        borderRadius: 10,
    },
    stampIcon: {
        height: 90,
        width: '90%',
        resizeMode: 'stretch',
        alignSelf: 'center',
        borderRadius: 5
    },
    coinIcon: {
        height: 60,
        width: '60%',
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    infoText: {
        fontSize: 12,
        // marginTop: 5,
        fontWeight: '500',
        color: colors.lightBlack,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    priceText: {
        fontSize: 10,
        marginTop: 5,
        fontWeight: '500',
        color: colors.lightBlack,
        textAlign: 'center',
    },

    itemCard: {
        backgroundColor: colors.cWhite,
        width: wp(36),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        borderRadius: 10,
        height: 145,
        justifyContent: 'center',
        alignItems: 'center'
    },
    coinIcon1: {
        height: 120,
        width: '70%',
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    stampIcon1: {
        height: '90%',
        width: "90%",
        resizeMode: "stretch",
        borderRadius: 5,
        alignSelf: "center",
    },
});