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
        backgroundColor: colors.cWhite
    },
    bottomBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(3),
        marginBottom: hp(2),
        paddingVertical: hp(1),
        borderTopWidth: 1,
        borderColor: colors.borderColor,
    },
    emptyList: {
        flex: 1,
        alignItems: 'center'
    },
    emptyText: {
        marginTop: hp(30), 
        color: colors.theme
    }
});