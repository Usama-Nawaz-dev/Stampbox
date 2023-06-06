import React, { useContext } from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'

import colors from '../constant/colors'
import AppText from './AppText';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AuthContext from '../src/Context/AuthContext';
import ThemeContext from '../src/Context/ThemeContext';
// import { dark as theme } from '../constant/colorsConfig';

const ShippingCard = (props) => {
    const { onPress } = props;
    const { myState: { language } } = useContext(AuthContext);
    const { theme }= useContext(ThemeContext);
    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: theme?.cardColor}]} onPress={onPress}>
            <View style={styles.imageSection}>
                <Image source={{ uri: 'https://picsum.photos/200/300' }} style={styles.stampImg} />
                <AppText style={styles.stampItem}>France Letter Envelope 1938 Paris to Argentina</AppText>
            </View>
            <View style={[styles.infoSection, { marginBottom: 5 }]}>
                <AppText style={styles.text}>{language?.quantity}: 01</AppText>
                <AppText style={styles.text}>02 Jan, 2022</AppText>
            </View>
            <View style={styles.infoSection}>
                <AppText style={styles.text}>{language?.country}: Canada</AppText>
                <AppText style={styles.text}>{language?.price}: <AppText style={{ color: colors.red }}>$6.76</AppText></AppText>
            </View>
        </TouchableOpacity>
    )
}

export default ShippingCard

const styles = StyleSheet.create({
    //Shipping Card
    card: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        padding: wp(2),
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        borderRadius: 7
    },
    imageSection: {
        flexDirection: 'row',
        marginBottom: 20
    },
    stampImg: {
        width: 60,
        height: 45
    },
    stampItem: {
        fontSize: 12,
        maxWidth: wp(35),
        marginLeft: 15
    },
    infoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 12
    }
})