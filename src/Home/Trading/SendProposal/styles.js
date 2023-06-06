import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: colors.cWhite,
    },
    topSection: {
        marginTop: hp(1),
        paddingVertical: hp(2),
        paddingHorizontal: wp(3),

    },
    cardSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: wp(3),
    },
    nameText: {
        fontSize: 18,
        fontWeight: '600',
        // color: colors.lightBlack
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
        // color: colors.lightBlack,
        paddingHorizontal: wp(3)
    },
    card: {
        backgroundColor: colors.cWhite,
        height: 140,
        width: wp(36),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        borderRadius: 10,
    },
    stampIcon: {
        height: 100,
        width: '90%',
        resizeMode: 'stretch',
        alignSelf: 'center',
        borderRadius: 5
    },
    stampIcon1: {
        height: 70,
        width: '90%',
        resizeMode: 'stretch',
        alignSelf: 'center',
        borderRadius: 5
    },
    coinIcon: {
        height: 120,
        width: '70%',
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    coinIcon1: {
        height: 50,
        width: '70%',
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 5
    },
    addSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(3),
        paddingHorizontal: wp(3)
    },
    addItem: {
        height: 100,
        width: 170,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 10
    },
    itemIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    itemIcon1: {
        width: 34,
        height: 34,
        resizeMode: 'contain',
    },
    stampText: {
        marginTop: 10,
        color: colors.lightText
    },
    btnSection: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(3),
        bottom: hp(2),
        width: '100%'
    },
    removeItem: {
        position: 'absolute',
        zIndex: 999,
        top: 1,
        right: 5
    },

    cardMultiple: {
        backgroundColor: colors.cWhite,
        height: 90,
        width: wp(24),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        borderRadius: 10,
    },

    //Coin Modal
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        paddingVertical: hp(1),
        width: '94%',
        backgroundColor: "white",
        borderRadius: 5,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.86,
        elevation: 5
    },
    closeBtn: {
        position: 'absolute',
        right: wp(3),
        top: hp(1)
    },
    modalText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: "center",
        color: colors.heading
    },
    coinSection: {
        width: 46,
        height: 46,
        borderRadius: 100,
        backgroundColor: colors.cWhite,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    },
    valueSection: {
        backgroundColor: colors.theme,
        padding: 10,
        paddingLeft: 20,
        borderBottomRightRadius: 7,
        borderTopRightRadius: 7,
        marginLeft: -10
    },
    coinText: {
        color: colors.cWhite,
    },
    inputSection: {
        width: '88%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
        height: 36,
        margin: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: colors.borderColor
    },
});