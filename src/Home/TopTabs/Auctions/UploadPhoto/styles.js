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
        backgroundColor: '#fff'
    },
    phoneSection: {
        marginTop: hp(10),
        paddingHorizontal: wp(3)
    },
    stampboxSection: {
        marginTop: hp(4),
        paddingHorizontal: wp(3)
    }
});