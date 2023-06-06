
import { StyleSheet, Dimensions } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";


const { height, width } = Dimensions.get('window');

import colors from '../../../../constant/colors'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        backgroundColor: '#fff',
    },
    labelStyle: {
        textAlign: "center",
        fontSize: 14,
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
    listStyle: {
        paddingHorizontal: wp(3),
        marginBottom: 10,
        backgroundColor: '#fff'
    }
})