import React, { useContext } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import AppText from '../AppText'
import FastImage from 'react-native-fast-image';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";


import Helper from '../../src/Helper';
import colors from '../../constant/colors';
import Fonts from '../../assets/fonts/Fonts';
import AuthContext from '../../src/Context/AuthContext';

export const SuggestedClubs = (props) => {
    const { onPress, Item } = props;
    const { myState : {language}}= useContext(AuthContext);

    return (
        <View style={styles.bgImage}>
            <FastImage source={{ uri: Item?.image_url }} style={styles.clubImg} />
            <View style={styles.infoSection}>
                <View>
                    <AppText style={styles.heading} numberOfLines={1}>
                        {Item ? Helper.capitalizeFirstLetter(Item?.name) : "Fletcher Mercado"}</AppText>
                    <AppText style={styles.text}>
                        {Item?.club_members_count} {language?.members}
                    </AppText>
                </View>
                <TouchableOpacity onPress={onPress}>
                    <AppText style={styles.heading}>{language?.viewClub}</AppText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bgImage: {
        height: 155,
        width: wp(60),
        borderRadius: 10,
        marginRight: wp(2),
    },
    clubImg: {
        height: '70%',
        width: '100%',
        borderTopEndRadius: 10,
        borderTopLeftRadius: 10
    },
    heading: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.cWhite,
    },
    text: {
        fontSize: 10,
        paddingTop: 3,
        color: colors.cWhite,
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(2),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: colors.color8
    }
})