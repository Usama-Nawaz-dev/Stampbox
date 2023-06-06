import { StyleSheet } from 'react-native'

import colors from '../../../../constant/colors'
import Fonts from '../../../../assets/fonts/Fonts'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen'


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    scroll: {
        width: '90%',
        alignSelf: 'center',
        marginBottom: hp(2)
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
    checkSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(1.5),
    },
    buyText: {
        marginRight: wp(3),
        color: colors.placeholderText,
        fontFamily: Fonts.Roboto_Regular
    },
    btnSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(3)
    }
})