import React, { useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { styles } from './styles'

import AppText from '../../../components/AppText'
import Header from '../../../components/Header'

import Feather from 'react-native-vector-icons/Feather'
import Btn from '../../../components/BorderBtn'
import colors from '../../../constant/colors'
import AuthContext from '../../Context/AuthContext'

export const InvoiceDetails = (props) => {
    const {myState:{language}}=useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Header title="Invoice Details" onPress={() => props.navigation.goBack()} />
            <View style={styles.card}>
                <View style={styles.statusSection}>
                    <AppText>Shipped To</AppText>
                    <AppText style={styles.status}>{language?.PENDING}</AppText>
                </View>
                <AppText style={styles.infoText}>Joanna Evans</AppText>
                <AppText style={styles.infoText}>641 Counts Lane Wilmore, KY 40390</AppText>
                <AppText style={styles.infoText}>joannaevans@gmail.com</AppText>
                <AppText style={styles.infoText}>012-345-6789</AppText>
                <View style={styles.summarySection}>
                    <AppText>Order Summary</AppText>
                </View>
                <View style={styles.detailsSection}>
                    <AppText style={styles.nameText}>Canada KGV Postal History Cover Fdc</AppText>
                    <View style={[styles.statusSection, { marginTop: 10 }]}>
                        <View>
                            <AppText style={styles.detailText}>Price</AppText>
                            <AppText style={styles.detailText1}>$12</AppText>
                        </View>
                        <View>
                            <AppText style={styles.detailText}>Quantity</AppText>
                            <AppText style={styles.detailText1}>02</AppText>
                        </View>
                        <View>
                            <AppText style={styles.detailText}>Total</AppText>
                            <AppText style={styles.detailText1}>$12.00</AppText>
                        </View>
                    </View>
                </View>
                <View style={styles.detailsSection}>
                    <AppText style={styles.nameText}>France Letter Envelope 1938 Paris to Argentina</AppText>
                    <View style={[styles.statusSection, { marginTop: 10 }]}>
                        <View>
                            <AppText style={styles.detailText}>Price</AppText>
                            <AppText style={styles.detailText1}>$12</AppText>
                        </View>
                        <View>
                            <AppText style={styles.detailText}>Quantity</AppText>
                            <AppText style={styles.detailText1}>02</AppText>
                        </View>
                        <View>
                            <AppText style={styles.detailText}>Total</AppText>
                            <AppText style={styles.detailText1}>$12.00</AppText>
                        </View>
                    </View>
                </View>
                <View style={{ paddingVertical: 10 }}>
                    <View style={styles.priceSection}>
                        <AppText>Sub Total:</AppText>
                        <AppText>$120.00</AppText>
                    </View>
                    <View style={styles.priceSection}>
                        <AppText>Discount:</AppText>
                        <AppText>$20.20</AppText>
                    </View>
                    <View style={styles.priceSection}>
                        <AppText>Shipping:</AppText>
                        <AppText>$20.20</AppText>
                    </View>
                    <View style={styles.priceSection}>
                        <AppText>Tax:</AppText>
                        <AppText>$2.00</AppText>
                    </View>
                    <View style={styles.priceSection}>
                        <AppText>Total:</AppText>
                        <AppText>$200.00</AppText>
                    </View>
                </View>
                <View style={styles.bottomButton}>
                    <TouchableOpacity style={styles.printButton}>
                        <Feather name="printer" color={"#fff"} size={24} />
                    </TouchableOpacity>
                    <Btn label="Close"
                        fontSize={12}
                        height={27}
                        width={80}
                        backgroundColor={colors.theme}
                    />
                </View>
            </View>
        </View>
    )
}
