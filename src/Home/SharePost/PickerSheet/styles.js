import { StyleSheet, Dimensions } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    // Bottom Sheet
    bottomSheet: {
        height: '100%',
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        marginTop: 10
    },
    picker: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: wp(3.5),
        marginHorizontal: wp(6)
    },
    pickerText: {
        fontSize: 12,
        marginLeft: wp(5)
    }
})