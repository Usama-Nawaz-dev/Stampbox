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
    labelStyle: {
        fontSize: 14,
        textAlign: "center",
        textTransform: "none",
        fontFamily: Fonts.IBM_SemiBold,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        color: colors.theme,
        fontWeight: '500'
    },
    listStyle: {
        marginTop: hp(1.5),
        paddingHorizontal: wp(3)
    }
})