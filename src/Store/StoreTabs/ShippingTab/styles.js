
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
        // paddingHorizontal: wp(3),
    },
    switchSection: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 15,
        alignItems: 'center',
        paddingHorizontal: wp(3)
    },
    selectedTab: {
        backgroundColor: colors.theme,
        paddingVertical: wp(2),
        paddingHorizontal: wp(3),
        borderRadius: 5,
        marginRight: 10
    },
    defaultTab: {
        backgroundColor: 'lightgrey',
        paddingVertical: wp(2),
        paddingHorizontal: wp(3),
        borderRadius: 5,
        marginRight: 10
    },
    tabText: {
        fontSize: 12,
        color: '#fff'
    },
})