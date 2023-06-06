import { StyleSheet, Dimensions } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from '../../../../../assets/fonts/Fonts';
import colors from '../../../../../constant/colors';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    infoSection: {
        paddingHorizontal: wp(3),
        paddingTop: hp(1)
    },
    heading: {
        fontSize: 16,
        // flexWrap: 'wrap',
        width: wp(60),
        fontFamily: Fonts.IBM_SemiBold,
        color: colors.heading
    },
    infoCard: {
        marginTop: 10,
        backgroundColor: colors.cWhite,
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 2.8,
        borderRadius: 5,
        padding: 10
    },
    stampImg: {
        width: 90,
        height: 110,
        marginRight: 15,
    },
    text: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.lightBlack,
        marginTop: 5
    },
    infoText: {
        color: colors.placeholderText,
        fontWeight: '400'
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
});