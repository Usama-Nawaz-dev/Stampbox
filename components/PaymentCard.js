import React, { useContext } from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'

import colors from '../constant/colors'
import AppText from './AppText';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ThemeContext from '../src/Context/ThemeContext';
// import { dark as theme } from '../constant/colorsConfig';

const PaymentCard = (props) => {
    const { onPress } = props;
    const { theme }= useContext(ThemeContext);
    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: theme?.cardColor}]} onPress={onPress}>
            <View style={styles.topSection}>
                <AppText style={styles.stampItem}>Invoice: #UDF787868</AppText>
                <AppText style={styles.status}>Paid</AppText>
            </View>
            <View style={[styles.infoSection]}>
                <AppText style={styles.text}>Billing NAme</AppText>
                <AppText style={styles.text}>Ashley</AppText>
            </View>
            <View style={styles.infoSection}>
                <AppText style={styles.text}>Sun, 8:40PM,Jan 02, 2022</AppText>
                <AppText style={styles.text}>Amount: <AppText style={{ color: colors.red }}>$6.76</AppText></AppText>
            </View>
        </TouchableOpacity>
    )
}

export default PaymentCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        padding: wp(2),
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        borderRadius: 7
    },
    topSection: {
        // marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    stampItem: {
        fontSize: 12,
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
    infoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    text: {
        fontSize: 12
    }
})