import { StyleSheet } from 'react-native'

import { 
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp, 
    } from "react-native-responsive-screen";

import colors from '../../../constant/colors'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    inputsSection: {
        flex: 0.55,
        width: "85%",
        alignSelf: "center"
        // backgroundColor: "grey",
    },
    backIcon: {
        width: hp(4),
        height: hp(4),
        backgroundColor: 'white',
        padding: wp(1),
        borderRadius: hp(5),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: hp(2),
        left: hp(1),
        zIndex: 999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }
})