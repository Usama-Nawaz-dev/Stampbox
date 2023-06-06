import React, { useContext } from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'

import colors from '../../constant/colors'
import AppText from '../AppText';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { images } from '../../assets/images/Images';
import moment from 'moment';
import AuthContext from '../../src/Context/AuthContext';
import ThemeContext from '../../src/Context/ThemeContext';

export const ChoosePropCard = (props) => {
    const { onPress, ItemDetail } = props;
    // console.log(ItemDetail)
    const{ myState:{language}}=useContext(AuthContext);
    const { theme }= useContext(ThemeContext);
    let stampUri;
    let stampName;
    let coinVal;
    if (ItemDetail?.trade_offers[0]?.trade?.accepting_offer == "coins_and_stamps") {
        if (ItemDetail?.trade_offers[0]?.trade_offerables[0]?.type === "Model") {
            stampUri = ItemDetail?.trade_offers[0]?.trade_offerables[0]?.trade_offerable?.medias[0]?.media_url;
            stampName = ItemDetail?.trade_offers[0]?.trade_offerables[0]?.trade_offerable?.name;
        } else if (ItemDetail?.trade_offers[0]?.trade_offerables[1]?.type === "Model") {
            stampUri = ItemDetail?.trade_offers[0]?.trade_offerables[1]?.trade_offerable?.medias[0]?.media_url;
            stampName = ItemDetail?.trade_offers[0]?.trade_offerables[1]?.trade_offerable?.name;
        } else {
            stampUri = null;
            stampName = null;
            coinVal = ItemDetail?.trade_offers[0]?.trade_offerables[0]?.value
        }
    } else if (ItemDetail?.trade_offers[0]?.trade?.accepting_offer == "stamps") {
        stampUri = ItemDetail?.trade_offers[0]?.trade_offerables[0]?.trade_offerable?.medias[0]?.media_url;
        stampName = ItemDetail?.trade_offers[0]?.trade_offerables[0]?.trade_offerable?.name;
    } else {
        coinVal = ItemDetail?.trade_offers[0]?.trade_offerables[0]?.value
    }

    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: theme?.cardColor}]} onPress={onPress} >
            <AppText style={styles.propId}>Proposal ID: {ItemDetail?.trade_offers[0]?.proposal_id}</AppText>
            <View style={styles.rowSection}>
                <Image source={stampUri ? { uri: stampUri } : images.Coin}
                    style={stampUri ? styles.stampImg : styles.coinIcon} />
                <View style={{ marginLeft: 10 }}>
                    {stampName ? <AppText style={styles.title}>{stampName}</AppText> :
                        <AppText style={styles.title}>Offered Coins: {coinVal}</AppText>}
                    <AppText style={[styles.text, { color: theme?.lightText}]} numberOfLines={2}>
                        {ItemDetail?.trade_offers[0]?.description}</AppText>
                    <AppText style={[styles.text, { color: theme?.lightText}]}>Status: {ItemDetail?.trade_offers[0]?.status}</AppText>
                    <AppText style={[styles.text, { color: theme?.lightText}]}>{language?.offers}: {ItemDetail?.trade_offers_count}</AppText>
                </View>
            </View>
            <View style={styles.lowerSection}>
                <AppText style={styles.chooseText}>Choose Proposal</AppText>
            </View>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        borderRadius: 7,
    },
    propId: {
        position: 'absolute',
        fontSize: 12,
        fontWeight: '500',
        right: wp(2),
        top: 5
    },
    linkCard: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageSection: {
        flexDirection: 'row',
    },
    stampImg: {
        width: 105,
        height: 80,
        borderRadius: 5,
        resizeMode: 'stretch'
    },
    coinIcon: {
        width: 80,
        height: 80,
    },
    title: {
        fontSize: 14,
        maxWidth: wp(70),
        fontWeight: '500',
        maxWidth: wp(60)
    },
    text: {
        maxWidth: wp(70),
        marginTop: 3,
        color: colors.lightText,
        fontSize: 12,
        maxWidth: wp(55)
    },
    rowSection: {
        flexDirection: 'row',
        paddingHorizontal: wp(3),
        marginTop: 15,

    },
    lowerSection: {
        marginTop: 5,
        backgroundColor: colors.greenish,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7
    },
    chooseText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.cWhite,
        textAlign: 'center',
        paddingVertical: 5
    }
})