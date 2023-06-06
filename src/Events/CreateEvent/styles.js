import { StyleSheet } from 'react-native'

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen'

import colors from '../../../constant/colors'
import Fonts from '../../../assets/fonts/Fonts'

export const styles = StyleSheet.create({
    mainConatiner: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    scroll: {
        marginBottom: hp(2),
        paddingHorizontal: wp(5)
    },
    // Media Section
    mediaSection: {
        marginTop: hp(2.5),
    },
    mediaText: {
        fontSize: 16,
        fontFamily: Fonts.IBM_Medium,
    },
    infoText: {
        fontSize: 12,
        marginTop: hp(0.5),
        fontFamily: Fonts.IBM_Regular,
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
    //Inputs
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    checkSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(1.5),
    },
    parkingText: {
        marginRight: wp(3),
        color: colors.placeholderText,
        fontFamily: Fonts.Roboto_Regular
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingBottom: 10,
        height: 55,
    }
})