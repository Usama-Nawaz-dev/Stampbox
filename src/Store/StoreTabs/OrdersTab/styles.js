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
        backgroundColor: colors.white
    },

})
