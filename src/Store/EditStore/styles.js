import { StyleSheet, Dimensions } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../constant/colors';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    coverSection: {
        marginTop: 20,
        marginHorizontal: wp(3),
    },
    inputSection: {
        marginTop: 20,
        paddingHorizontal: wp(3)
    },
    inputText: {
        fontSize: 12,
        marginTop: 10,
        marginBottom: hp(0.5),
        color: colors.placeholderText,
        fontFamily: Fonts.Roboto_Regular
    },
    descriptionInput: {
        height: 150,
        fontSize: 14,
        padding: 10,
        paddingTop: 10,
        borderRadius: 7,
        borderWidth: 0.5,
        borderColor: 'lightgrey',
        fontFamily: 'Roboto-Regular',
        color: colors.cBlack
    },
    btnStyle: {
        alignSelf: 'center',
        marginTop: 30
    },


    //Image Picker Modal
    centeredView: {
        width: wp(50),
        marginTop: hp(35),
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
});