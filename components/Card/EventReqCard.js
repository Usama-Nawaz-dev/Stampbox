import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import moment from 'moment';
import AppText from '../AppText';
import colors from '../../constant/colors';
import Fonts from '../../assets/fonts/Fonts';

import AuthContext from '../../src/Context/AuthContext';

import Helper from '../../src/Helper';
import BorderBtn from '../BorderBtn';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

export const EventReqCard = (props) => {
    const { Item, User, onPress, onReject, onPressDetail } = props;
    const createdAt = moment(Item?.created_at).fromNow();
    const{ myState : { language }}= useContext(AuthContext)

    return (
        <View style={styles.userSection}>
            <View style={styles.topSection}>
                <FastImage style={styles.userImg}
                    source={{ uri: User?.image_url }}
                />
                <View style={{ marginLeft: wp(2) }}>
                    <AppText style={styles.hourText}>{createdAt}</AppText>
                    <AppText style={styles.nameText} numberOfLines={1}>
                        {Helper.capitalizeFirstLetter(User?.full_name)}
                    </AppText>
                    <AppText style={styles.subText}>{Item?.message}</AppText>
                </View>
            </View>
            <TouchableOpacity style={styles.detailSection} onPress={onPressDetail}>
                <AppText style={styles.detailText}>{language?.seeDetails}</AppText>
            </TouchableOpacity>
            <View style={styles.btnSection}>
                <BorderBtn label={language?.accept}
                    height={30} width={wp(40)}
                    fontSize={14} radius={5}
                    fontColor={colors.cWhite}
                    borderWidth={2}
                    color={colors.color8}
                    backgroundColor={colors.color8}
                    loading={Item?.loading1}
                    onPress={onPress}
                />
                <BorderBtn label={language?.reject}
                    borderWidth={2}
                    height={30} width={wp(40)}
                    fontSize={14} radius={5}
                    marginHorizontal={wp(2)}
                    fontColor={colors.btnText}
                    color={colors.background}
                    loading={Item?.loading2}
                    onPress={onReject}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    userSection: {
        width: wp(94),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        borderRadius: 7,
        padding: wp(2),
        marginBottom: hp(1.5),
        backgroundColor: colors.cWhite,
    },
    topSection: {
        flexDirection: 'row',
    },
    hourText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.lightTheme
    },
    userImg: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: colors.background
    },
    nameText: {
        maxWidth: wp(28),
        color: colors.heading,
        marginVertical: hp(0.2),
        fontFamily: Fonts.IBM_Medium
    },
    subText: {
        fontSize: 12,
        color: colors.lightText,
    },
    btnSection: {
        marginTop: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    detailSection: {
        position: 'absolute',
        zIndex: 999,
        right: wp(2),
        top: wp(2)
    },
    detailText: {
        fontWeight: '500',
        color: colors.color8
    }
})