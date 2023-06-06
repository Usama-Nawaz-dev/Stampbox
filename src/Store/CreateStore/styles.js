
import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window');

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    coverSection: {
        marginTop: 20,
        marginHorizontal: wp(3),
    },
    inputsSection: {
        width: "90%",
        alignSelf: "center",
        marginTop: 25
    },
    inputText: {
        fontSize: 15,
        marginBottom: 5,
        color: colors.cBlack
    },
    dropdown: {
        borderColor: colors.borderColor,
        borderBottomWidth: 1,
        borderWidth: 0,
        borderRadius: 0,
        width: '90%',
        alignSelf: 'center',
        paddingHorizontal: 0,
        marginBottom: 0,
        height: 50
    },
    inputText: {
        fontSize: 12,
        marginTop: 10,
        marginBottom: hp(0.5),
        color: colors.placeholderText,
        fontFamily: Fonts.Roboto_Regular
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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