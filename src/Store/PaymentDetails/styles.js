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
        marginBottom: 10,
    },
    stampItem: {
        fontSize: 12
    },
    status: {
        fontSize: 12,
        color: '#fff',
        paddingVertical: wp(0.8),
        paddingHorizontal: wp(2.5),
        borderRadius: 5,
        backgroundColor: colors.green,
        overflow: "hidden"
    },
    infoText: {
        fontSize: 12,
        color: colors.lightText,
        marginBottom: 2
    },
    billedSection: {
        marginTop: 5,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: 'lightgrey'
    },
    buyerText: {
        marginTop: 10,
        marginBottom: 5
    },
    detailsSection: {
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: 'lightgrey'
    },
    orderText: {
        fontSize: 12,
        marginBottom: 5
    },
    orderText1: {
        color: colors.lightText
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