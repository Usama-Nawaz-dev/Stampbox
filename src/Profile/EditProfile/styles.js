import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from '../../../assets/fonts/Fonts';

import colors from '../../../constant/colors'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    editBtn: {
        width: 30,
        height: 30,
        backgroundColor: colors.lightTheme,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(10),
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 999,
    },
    userSection: {
        alignSelf: 'center',
        marginTop: -40,
        marginBottom: 15,
    },
    userImage: {
        width: 110,
        height: 110,
        borderRadius: hp(10),
        resizeMode: 'cover'
    },
    inputsSection: {
        width: "90%",
        alignSelf: "center",
        marginTop: 15,
        marginBottom: hp(5)
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    inputText: {
        fontSize: 12,
        marginTop: 10,
        marginBottom: hp(0.5),
        color: colors.placeholderText,
        fontFamily: Fonts.Roboto_Regular
    },

    //Image Picker Modal
    centeredView: {
        width: wp(50),
        marginTop: hp(40),
        alignSelf: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 7
    },
    modalView: {
        padding: wp(2),
    },
    headingText: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: hp(1),
        alignSelf: 'center'
    },
    modalText: {
        fontSize: 12,
        marginTop: hp(0.5),
        alignSelf: 'center',
        color: 'grey'
    },
    cancelButton: {
        fontSize: 11,
        color: 'red',
        fontWeight: '500',
        alignSelf: 'center',
        marginTop: hp(1),
        marginBottom: hp(1)
    }
})