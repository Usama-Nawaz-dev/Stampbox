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
        width: width,
        backgroundColor: '#fff',
        paddingTop: 10,
        // paddingHorizontal: wp(3)
    },
    switchSection: {
        flexDirection: 'row',
        marginTop: hp(1),
        paddingHorizontal: wp(3),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedTab: {
        backgroundColor: 'lightgrey',
        paddingVertical: wp(2.5),
        paddingHorizontal: wp(12),
        borderRadius: 5
    },
    defaultTab: {
        backgroundColor: 'transparent',
        paddingVertical: wp(2),
        paddingHorizontal: wp(10),
        borderRadius: 7
    },
    tabText: {
        fontSize: 14,
        color: colors.lightText
    },
    addText: {
        fontSize: 12,
        // color: colors.lightText,
        marginBottom: 5
    },
    emptySection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})