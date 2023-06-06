import { StyleSheet, Dimensions } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../../../constant/colors';
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    section: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height / 3.5,
        paddingHorizontal: wp(10)
    },
    button: {
        height: 130,
        width: 130,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.borderColor,
    },
    text: {
        marginTop: 5,
        fontWeight: '500',
        color: colors.lightBlack
    }
});