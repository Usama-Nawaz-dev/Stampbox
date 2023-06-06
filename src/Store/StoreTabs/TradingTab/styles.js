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
    },
    tabSection: {
        // flex: 1,
        marginTop: -5
    },
    headerScroll: {
        flexGrow: 0,
    },
    headerItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12
    },
    headerBar: {
        height: 1.8,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: colors.theme,
        position: 'absolute',
        bottom: 0
    },
})
