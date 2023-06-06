import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../constant/colors';
import Fonts from '../../../assets/fonts/Fonts';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    btnSection: {
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(5)
    },
    uploadBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.placeholderText,
        paddingHorizontal: wp(2),
        paddingVertical: wp(1.6),
        borderRadius: hp(10),
        marginBottom: hp(4)
    },
    uploadBtnText: {
        fontSize: 12,
        marginLeft: 5,
        color: colors.lightBlack,
        fontFamily: Fonts.Inter_Medium
    },
    avatar: {
        width: hp(10),
        height: hp(10),
        borderWidth: 1,
    },
    uploadText: {
        fontSize: 16,
        marginTop: hp(2),
        color: colors.heading,
        paddingHorizontal: wp(3),
        fontFamily: Fonts.IBM_Medium
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