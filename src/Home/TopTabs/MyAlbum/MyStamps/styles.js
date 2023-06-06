import { StyleSheet, Dimensions } from 'react-native'


import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../../../constant/colors'
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff'
    },
    mainItem: {
        width: width,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.lightText
    }
})