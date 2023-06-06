import React from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'

import AppText from '../AppText'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../constant/colors';

export const ExploreCard = (props) => {
    const { onPress, Item } = props;
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} >
            <Image
                style={styles.stampImg}
                source={{
                    uri: Item?.image_url ? Item?.image_url : "https://picsum.photos/600/600",
                }}
            />
            <View style={{ marginLeft: wp(3) }}>
                <AppText style={styles.heading} numberOfLines={1}>
                    {Item ? Item?.name : "Fletcher Mercado"}</AppText>
                <AppText style={styles.text}>
                    {Item?.description ? Item?.description : "Daleniti Adispiscing"}</AppText>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cWhite,
        flexDirection: 'row',
        alignItems: 'center',
        width: wp(92),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        borderRadius: 7,
        padding: wp(2)
    },
    stampImg: {
        width: 55,
        height: 55,
        borderRadius: 5,
    },
    heading: {
        fontSize: 16,
        color: colors.heading,
        fontWeight: '500',
        maxWidth: wp(70)
    },
    text: {
        color: colors.lightText,
        marginTop: 5,
        fontSize: 12
    },
})