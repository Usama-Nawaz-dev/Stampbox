import { StyleSheet } from 'react-native';

import colors from '../../../../../../constant/colors';
import Fonts from '../../../../../../assets/fonts/Fonts';

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },

    //Item Listing Styles
    listStyle: {
        paddingTop: hp(1),
        paddingHorizontal: wp(5)
    },
    mainItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.lightText
    },
})