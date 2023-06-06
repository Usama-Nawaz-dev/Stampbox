import { StyleSheet } from 'react-native'

import colors from '../../../../../constant/colors';
import Fonts from '../../../../../assets/fonts/Fonts';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    emptyList: {
        paddingTop: hp(0.5),
        alignItems: 'center',
        justifyContent: 'center'
    },
    listStyle: {
        marginTop: hp(0.5),
        paddingHorizontal: wp(4),
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: hp(25),
        color: colors.lightTheme
    },
})