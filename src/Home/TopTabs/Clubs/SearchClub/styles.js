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
        flex: 0.9,
        alignItems: 'center',
        justifyContent: 'center'
    },
    listStyle: {
        marginTop: hp(2),
        paddingHorizontal: wp(4),
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.lightTheme
    },
})