import React, { useContext, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import Image from "react-native-fast-image";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AppText from '../AppText';

import colors from '../../constant/colors';
import ThemeContext from '../../src/Context/ThemeContext';
// import { dark as theme } from '../../constant/colorsConfig';

export const SelectStamp = (props) => {
    const { ItemDetail, onPress, borderWidth } = props;
    const uri = ItemDetail?.medias[0]?.media_url;
    const { theme, mode } = useContext(ThemeContext);
    const [onSelect, setSelect] = useState(false);

    return (
        <TouchableOpacity style={[styles.card, { borderWidth: borderWidth ? borderWidth : 0 , backgroundColor: theme?.cardColor }]}
            onPress={onPress}>
            <Image style={styles.stampImg}
                resizeMode='contain' source={{ uri: uri }} />
            <View style={styles.bottomSection}>
                <AppText style={styles.nameText} numberOfLines={2}>
                    {ItemDetail ? ItemDetail?.name : "Deutsche Bundespost"}</AppText>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        // backgroundColor: colors.cWhite,
        width: wp(45),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        borderRadius: 10,
        padding: 5,
        borderColor: colors.theme,
        marginRight: wp(3),
        marginTop: hp(1.5)
    },
    stampImg: {
        width: '100%',
        height: 140,
    },

    nameText: {
        fontFamily: 'IBMPlexSans-Regular',
        fontWeight: '500',
        // color: colors.heading,
    },
    bottomSection: {
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: colors.borderColor,
        paddingVertical: 4,
        marginTop: 5
    },
})