import { StyleSheet } from 'react-native'

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
    mediaSection: {
        marginRight: wp(7),
        marginBottom: 20,
    },
    editStampCard: {
        width: wp(25),
        height: wp(25),
        borderColor: colors.theme,
        backgroundColor: colors.white,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        padding: 5
    },
    stampImg: {
        width: '100%',
        height: '100%',
        marginVertical: hp(0.3),
    },
    emptySection: {
        flex: 0.9,
        justifyContent: 'center'
    },
    bottomButton: {
        position: 'absolute',
        bottom: hp(3)
    }
})