import { StyleSheet, Dimensions } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";


const { height, width } = Dimensions.get('window');
import colors from '../../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite,
    },
    addButton: {
        position: 'absolute',
        backgroundColor: colors.color8,
        bottom: hp(2.4),
        right: wp(6),
        width: hp(6),
        height: hp(6),
        borderRadius: hp(10),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    },
    labelStyle: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: 'Roboto-Regular',
        paddingHorizontal: 5,
        textTransform: "none"
    },
    indicatorStyle: {
        borderBottomColor: colors.theme,
        borderBottomWidth: 1.8,
        height: 0
    },
    tabStyle: {
        justifyContent: "center",
        // width: 90,
        paddingHorizontal: 0
    },
})
