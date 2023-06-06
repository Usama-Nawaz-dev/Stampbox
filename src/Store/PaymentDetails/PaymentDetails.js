import React from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { styles } from './styles'

import AppText from '../../../components/AppText'
import Header from '../../../components/Header'

import Feather from 'react-native-vector-icons/Feather'
import Btn from '../../../components/BorderBtn'
import colors from '../../../constant/colors'

export const PaymentDetails = (props) => {
    return (
        <View style={styles.container}>
            <Header title="Invoice Details" onPress={() => props.navigation.goBack()} />
            <ScrollView>
                <View style={styles.card}>
                    <View style={styles.statusSection}>
                        <AppText style={styles.stampItem}>Invoice: #UDF787868</AppText>
                        <AppText style={styles.status}>Paid</AppText>
                    </View>
                    <AppText style={styles.infoText}>641 Counts Lane Wilmore, KY 40390</AppText>
                    <AppText style={styles.infoText}>joannaevans@gmail.com</AppText>
                    <AppText style={[styles.infoText, { marginBottom: 5 }]}>012-345-6789</AppText>
                    <View style={styles.billedSection}>
                        <AppText>Billed To:</AppText>
                        <AppText style={styles.buyerText}>Joana Evans</AppText>
                        <AppText style={styles.infoText}>641 Counts Lane Wilmore, KY 40390</AppText>
                        <AppText style={styles.infoText}>joannaevans@gmail.com</AppText>
                        <AppText style={[styles.infoText, { marginBottom: 0 }]}>012-345-6789</AppText>
                    </View>
                    <View style={styles.detailsSection}>
                        <AppText style={styles.orderText}>Order No: <AppText style={styles.orderText1}>#123456</AppText></AppText>
                        <AppText style={styles.orderText}>Invoice No: <AppText style={styles.orderText1}>#MN079H9</AppText></AppText>
                        <AppText style={styles.nameText}>Invoice Date: <AppText style={styles.orderText1}>01 Dec, 2021</AppText></AppText>
                    </View>
                    <View style={styles.detailsSection}>
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
                        <Btn label="Send"
                            fontSize={12}
                            height={27}
                            width={80}
                            backgroundColor={colors.theme}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
