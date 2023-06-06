import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../constant/colors';
import Fonts from '../../../assets/fonts/Fonts';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    topSection: {
        marginTop: hp(2),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftBtn: {
        width: wp(45),
        height: hp(4.3),
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightTheme
    },
    btnText: {
        fontSize: 12,
        color: colors.cWhite
    },
    albumDropdown: {
        width: wp(45),
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: wp(1),
        borderColor: colors.borderColor,
    },
    dropDown: {
        height: hp(3.5),
        marginTop: hp(0.5),
        alignSelf: 'center',
        borderBottomWidth: 0,
    },
    listStyle: {
        marginTop: hp(1),
        paddingHorizontal: wp(5)
    },

    //Empty List
    mainItem: {
        flex: 1,
        backgroundColor: colors.cWhite,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.lightText
    },
});