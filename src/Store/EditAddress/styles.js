
import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window');

import { 
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp, 
    } from "react-native-responsive-screen";

import colors from '../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    coverSection: {
        marginTop: 20,
        marginHorizontal: wp(3),
    },
    inputsSection: {
        width: "90%",
        alignSelf: "center",
        marginTop: 25
    },
})