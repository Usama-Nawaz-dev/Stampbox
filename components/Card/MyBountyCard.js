import React, { useContext } from 'react'
import { StyleSheet, View, TouchableOpacity, Pressable } from 'react-native'
import Image from "react-native-fast-image";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from '../AppText';
import colors from '../../constant/colors';
import { images } from '../../assets/images/Images';

import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useSelector } from "react-redux";
import AuthContext from '../../src/Context/AuthContext'
import ThemeContext from '../../src/Context/ThemeContext';
// import { dark as theme } from '../../constant/colorsConfig';

export const MyBountyCard = (props) => {
    const {
        ItemDetail, onEdit, onDelete,
        onOption, isActive, onPress,
        showBottomBtn = true
    } = props;
    const {myState:{language}}=useContext(AuthContext)
    const { theme }= useContext(ThemeContext)
    // console.log(ItemDetail)
    const media_uri = ItemDetail?.medias[0]?.media_url

    function kFormatter(num) {
        return `${Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)}`
    }
    return (
        <View style={[styles.card, { backgroundColor: theme?.white}]}>
            <Pressable onPress={onPress}>
                <Image style={styles.stampImg} source={{
                    uri: media_uri ? media_uri : "https://picsum.photos/600/600"
                }} />
            </Pressable>
            <Pressable style={[styles.infoSection, {backgroundColor: theme?.white}]} onPress={onPress}>
                <AppText style={[styles.stampId, { color: theme?.theme}]}>{ItemDetail?.uuid}</AppText>
                <AppText style={styles.nameText} numberOfLines={1}>
                    {ItemDetail?.title ? ItemDetail?.title : "Deutsche Bundespost Rare Stamp 1931"}</AppText>
                <View >
                    <AppText style={styles.text}>{language?.country}: {ItemDetail?.country ? ItemDetail?.country : "N/A"}</AppText>
                    <AppText style={styles.text}>{language?.yearIssued}: {ItemDetail?.year_issued ? ItemDetail?.year_issued : "N/A"}</AppText>
                    <AppText style={styles.text} numberOfLines={1}>Condition: {ItemDetail?.condition?.length ? ItemDetail?.condition.toString() : "N/A"}</AppText>
                    <AppText style={styles.text} numberOfLines={1}>Format: {ItemDetail?.format?.length ? ItemDetail?.format.toString() : "N/A"}</AppText>
                    <AppText style={styles.text}>{ItemDetail?.offers_count} Offers received</AppText>
                </View>
                <AppText style={styles.offerText}>{kFormatter(ItemDetail?.offered_coins)}
                    <AppText style={styles.coinText}> (Coins Offered)</AppText></AppText>
                <AppText style={styles.offerText}>${ItemDetail?.offered_amount ? ItemDetail?.offered_amount : 0}
                    <AppText style={styles.coinText}> ($$ Offered)</AppText></AppText>
            </Pressable>
            {showBottomBtn ? <View style={styles.bottomSection}>
                <TouchableOpacity onPress={onEdit}>
                    <Feather name='edit' size={24} color={colors.borderColor} />
                </TouchableOpacity >
                {isActive && <TouchableOpacity onPress={onDelete}>
                    <MaterialIcons name='delete-outline' size={28} color={colors.borderColor} />
                </TouchableOpacity>}
                <TouchableOpacity onPress={onOption}>
                    <MaterialIcons name='format-list-bulleted' size={28} color={colors.borderColor} />
                </TouchableOpacity>
            </View> : <View style={styles.noBtn} />}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cWhite,
        width: wp(45),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        borderRadius: 10,
        margin: 1,
    },
    stampId: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.theme,
        alignSelf: 'center',
    },
    stampImg: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    infoSection: {
        marginTop: -10,
        backgroundColor: colors.cWhite,
        paddingHorizontal: wp(2),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    nameText: {
        fontFamily: 'IBMPlexSans-Regular',
        fontWeight: '500',
        // color: colors.heading,
        marginBottom: 5
    },
    text: {
        fontSize: 12,
        // fontWeight: '500',
        // color: colors.lightText,
        marginBottom: 2
    },
    infoText: {
        fontWeight: '400',
        color: colors.lightText,
        alignSelf: 'center'
    },
    offerText: {
        fontWeight: '600',
        color: colors.theme
    },
    coinText: {
        fontSize: 10,
        color: colors.borderColor,
        fontWeight: '400'
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        height: 35,
        borderColor: colors.borderColor,
        paddingHorizontal: wp(2),
        marginTop: 10
    },
    icon: {
        width: 15,
        height: 15
    },
    noBtn: {
        margin: 5,
    }
})