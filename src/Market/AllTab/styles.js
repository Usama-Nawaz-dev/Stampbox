import { StyleSheet, Dimensions } from 'react-native'

import { 
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp, 
} from "react-native-responsive-screen";

import colors from '../../../constant/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: colors.cWhite,
        paddingTop: 5,
    },
    itemSection: {
        paddingHorizontal: wp(3),
    },
    upperSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    heading: {
        fontFamily: 'IBMPlexSans-Bold',
        // color: colors.lightBlack,
        fontSize: 20,
    },
    btnText: {
        // color: colors.lightBlack,
        fontSize: 14
    },
    lowerSection: {
        paddingVertical: hp(1.5),
    },
    inActiveText: {
        color: colors.theme,
        textAlign: 'center',
        fontSize: 15
    },
});