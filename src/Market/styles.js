import { StyleSheet, Dimensions } from 'react-native'

import { 
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp, 
} from "react-native-responsive-screen";

import colors from '../../constant/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30
    },
    headerScroll: {
        flexGrow: 0,
        position: 'absolute',
        top: -125,
        zIndex: 999,
        marginRight: 35,
        alignSelf:'center'
    },
    headerItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 65,
        height: 65,
        borderRadius: 5,
        marginRight: 10
    },
    mainItem: {
        width: width,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },

});