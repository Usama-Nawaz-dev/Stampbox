import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Image from "react-native-fast-image";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "../AppText";
import colors from "../../constant/colors";
import UserCard from "../UserCard";
import { images } from "../../assets/images/Images";

import Entypo from "react-native-vector-icons/Entypo";
import { useSelector } from "react-redux";
import AuthContext from "../../src/Context/AuthContext";
import ThemeContext from "../../src/Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

export const ProposalsCard = (props) => {
    const { onViewProposal, ItemDetail } = props;
    const { myState: { language }}= useContext(AuthContext);
    // console.log('ItemDetails--->', ItemDetail)
    const currentUser = useSelector((state) => state.ApiReducer.user);
    const { theme }= useContext(ThemeContext);
    const stampUri = ItemDetail?.trade_offers[0]?.trade_offerables[0]?.trade_offerable?.medias[0]?.media_url;
    return (
        <View style={[styles.card, { backgroundColor: theme?.cardColor}]}>
            <View>
                <Image resizeMode='contain'
                    style={stampUri ? styles.stampImg : styles.coinIcon}
                    source={stampUri ? { uri: stampUri } : images.Coin} />
            </View>
            <View style={[styles.infoSection, { backgroundColor: theme?.cardColor}]}>
                <AppText style={[styles.stampId, { color : theme?.theme}]}>{ItemDetail?.trade?.uuid}</AppText>
                <AppText style={styles.nameText} numberOfLines={1}>
                    {ItemDetail?.trade_offers[0]?.description}</AppText>
                <AppText style={styles.text}>{language?.offers}: {ItemDetail?.trade_offers_count}</AppText>
                <AppText numberOfLines={1} style={styles.text}>{language?.status}: {ItemDetail?.status}</AppText>
            </View>

            <TouchableOpacity
                style={styles.proposalBtn}
                onPress={onViewProposal}
            // onPress={()=> console.log('detail', ItemDetail)}
            >
                <AppText style={styles.proposalText}>{language?.viewProposal}</AppText>
                <Entypo name='chevron-right' size={14} color={colors.cWhite} />
            </TouchableOpacity>
            <View style={styles.userSection}>
                <UserCard starColor={colors.theme} User={ItemDetail?.trade_offers[0]?.user} />
            </View>
        </View >
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
    coinIcon: {
        width: 120,
        height: 150,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignSelf: 'center'
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
        // color: colors.lightText,
        marginBottom: 2
    },
    proposalBtn: {
        flexDirection: 'row',
        backgroundColor: colors.lightTheme,
        borderRadius: 5,
        marginVertical: 5,
        width: wp(30),
        height: 26,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    proposalText: {
        fontSize: 10,
        marginRight: 5,
        fontWeight: '600',
        color: colors.cWhite
    },
    userSection: {
        paddingHorizontal: wp(2),
        paddingVertical: 2,
        backgroundColor: `${colors.lightTheme}30`,
        borderTopWidth: 1,
        borderColor: colors.borderColor,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
})
