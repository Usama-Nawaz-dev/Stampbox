import { StyleSheet, Dimensions } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../../constant/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    labelStyle: {
        textAlign: "center",
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        paddingHorizontal: 5,
        textTransform: "none"
    },
});