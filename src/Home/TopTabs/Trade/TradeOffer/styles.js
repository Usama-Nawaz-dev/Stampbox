import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Fonts from '../../../../../assets/fonts/Fonts';
import colors from '../../../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite,
    },
    mainCard: {
        width: "94%",
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: colors.cWhite,
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    innerCard: {
        backgroundColor: colors.cWhite,
        height: 140,
        width: 120,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        // alignSelf: "flex-start",
    },
    stampImg: {
        height: 120,
        width: 80,
    },
    cardSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    separator: {
        width: "100%",
        height: 1,
        backgroundColor: "lightgrey",
        marginTop: 20,
    },
    title: {
        fontWeight: "600",
        fontSize: 18,
        marginLeft: 20,
        marginTop: 15,
        marginBottom: 15,
        // color: colors.lightBlack
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
})