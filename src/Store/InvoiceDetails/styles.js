import { StyleSheet, Dimensions } from 'react-native'

import { 
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp, 
} from "react-native-responsive-screen";


const { height, width } = Dimensions.get('window');

import colors from '../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        padding: wp(3),
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        borderRadius: 7,
        marginHorizontal: wp(3),
        marginTop: 15
    },
    statusSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    status: {
        fontSize: 12,
        color: '#fff',
        paddingVertical: wp(1),
        paddingHorizontal: wp(2),
        borderRadius: 5,
        backgroundColor: colors.theme,
        overflow: "hidden"
    },
    infoText: {
        fontSize: 12,
        color: colors.lightText,
        marginBottom: 2
    },
    summarySection: {
        marginTop: 5,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: 'lightgrey'
    },
    detailsSection: {
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: 'lightgrey'
    },
    nameText: {
        fontSize: 12
    },
    detailText: {
        fontSize: 10
    },
    detailText1: {
        fontSize: 10,
        color: colors.lightText,
        marginTop: 5
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3
    },
    bottomButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    printButton: {
        marginRight: 10,
        backgroundColor: colors.green,
        padding: wp(1),
        borderRadius: 5
    }
})