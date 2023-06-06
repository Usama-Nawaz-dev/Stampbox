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
    infoSection: {
        paddingTop: hp(2.5),
        paddingHorizontal: wp(3),
    },
    heading: {
        fontSize: 16,
        marginBottom: hp(0.5),
        color: colors.heading,
        fontFamily: Fonts.IBM_SemiBold
    },
    input: {
        height: 90,
        padding: 10,
        paddingTop: 5,
        borderRadius: 7,
        borderWidth: 0.5,
        marginBottom: hp(1.5),
        color: colors.btnText,
        fontFamily: Fonts.IBM_Regular,
        borderColor: colors.borderColor,
    },
})