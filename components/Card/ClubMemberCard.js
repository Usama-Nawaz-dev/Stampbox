import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import AppText from '../AppText';
import colors from '../../constant/colors';
import Fonts from '../../assets/fonts/Fonts';
import { images } from '../../assets/images/Images';
import Helper from '../../src/Helper';

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';

export const ClubMemberCard = (props) => {
    const currentUser = useSelector((state) =>
        state.ApiReducer.user);
    const clubDetail = useSelector((state) =>
        state.DetailReducer.clubDetail);

    const { User, Item, onPress } = props;
    const owner = User?.id === currentUser?.id;

    return (
        <View style={styles.userSection}>
            <View style={styles.topSection}>
                <FastImage style={styles.userImg}
                    source={{ uri: User?.image_url }}
                />
                <View style={{ marginLeft: wp(2) }}>
                    <AppText style={styles.nameText} numberOfLines={1}>
                        {Helper.capitalizeFirstLetter(User?.full_name)}
                    </AppText>
                    <View style={styles.topSection}>
                        <Image
                            source={images.UserIcon}
                            style={styles.userIcon} />
                        <AppText style={styles.subText}>{Item?.type ? Helper.capitalizeFirstLetter(Item?.type) : User?.mrs_badge}</AppText>
                    </View>
                </View>
            </View>
            {clubDetail?.is_current_user_admin ? <View>
                {Item?.type !== "super_admin" && !owner &&
                    <TouchableOpacity style={styles.menuBtn} onPress={onPress}>
                        <Feather name='chevron-down'
                            size={20} color={colors.btnText} />
                    </TouchableOpacity>}
            </View> : null}
        </View>
    )
}


const styles = StyleSheet.create({
    userSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        marginBottom: hp(1.5),
        width: wp(94)
    },
    topSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userImg: {
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: colors.background
    },
    nameText: {
        marginBottom: 3,
        maxWidth: wp(28),
        color: colors.cBlack,
        fontFamily: Fonts.IBM_Medium
    },
    userIcon: {
        width: 14,
        height: 14,
        marginRight: wp(1),
        tintColor: colors.color9
    },
    subText: {
        color: colors.lightText,
        fontFamily: Fonts.Roboto_Regular
    },
    menuBtn: {
        borderWidth: 2,
        borderRadius: 5,
        borderColor: colors.borderColor
    }
})