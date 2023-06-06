import { StyleSheet, Dimensions } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from '../../../../assets/fonts/Fonts';

import colors from '../../../../constant/colors';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    coverSection: {
        marginTop: 20,
    },
    mediaSection: {
        marginTop: hp(2.5),
        marginLeft: 5
      },
      mediaText: {
        fontSize: 16,
        fontFamily: Fonts.IBM_Medium,
      },
      addStampCard: {
        width: hp(9),
        height: hp(9),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        marginTop: hp(1),
      },
      editStampCard: {
        width: hp(10),
        height: hp(10),
        borderWidth: 2,
        borderRadius: 5,
        marginTop: hp(1),
        marginLeft: hp(1.5),
      },
      crossIcon: {
        position: "absolute",
        alignSelf: "flex-end",
      },
      stampImg: {
        width: hp(5),
        height: hp(9),
        marginVertical: hp(0.3),
        alignSelf: "center",
      },
      itemPicker: {
        marginTop: hp(1),
      },
    scroll: {
        paddingHorizontal: wp(5)
    },
    inputText: {
        fontSize: 12,
        marginTop: 15,
        marginBottom: 5,
        // color: colors.placeholderText
    },
    descriptionInput: {
        height: 100,
        fontSize: 14,
        padding: 10,
        borderRadius: 7,
        borderWidth: 1,
        color: colors.btnText,
        borderColor: colors.borderColor,
        fontFamily: Fonts.IBM_Regular,
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