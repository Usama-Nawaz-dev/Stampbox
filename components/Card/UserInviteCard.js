import React, { useContext } from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';

import AppText from '../AppText';
import colors from '../../constant/colors';
import Fonts from '../../assets/fonts/Fonts';
import { images } from '../../assets/images/Images';

import Helper from '../../src/Helper';
import BorderBtn from '../BorderBtn';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import AuthContext from '../../src/Context/AuthContext';
import ThemeContext from '../../src/Context/ThemeContext';
// import { dark as theme } from '../../constant/colorsConfig';

export const UserInviteCard = (props) => {
    const {
        User, onPress, invited,
        onCancelInvite, btnTitle,
        showBorder, btnDisable, onViewDetail
    } = props;
    const { myState: { language } } = useContext(AuthContext);
    const { theme }= useContext(ThemeContext);
    return (
        <View style={styles.userSection}>
            <View style={styles.topSection}>
                <FastImage style={styles.userImg}
                    source={{ uri: User?.image_url }}
                />
                <Pressable style={{ marginLeft: wp(2) }} onPress={onViewDetail}>
                    <AppText style={[styles.nameText, { color: theme?.black}]} numberOfLines={1}>
                        {Helper.capitalizeFirstLetter(User?.full_name)}
                    </AppText>
                    <View style={styles.topSection}>
                        <Image
                            source={images.UserIcon}
                            style={styles.userIcon} />
                        <AppText style={styles.subText}>{User?.mrs_badge}</AppText>
                    </View>
                </Pressable>
            </View>
            <View>
                {invited ? (
                    <View style={styles.topSection}>
                        <BorderBtn label={language?.reject}
                            borderWidth={2}
                            height={30} width={90}
                            fontSize={14} radius={5}
                            marginHorizontal={wp(2)}
                            fontColor={colors.btnText}
                            color={colors.background}
                            loading={User?.loading}
                            onPress={onCancelInvite}
                        />
                        <BorderBtn label={language?.accept}
                            height={30} width={90}
                            fontSize={14} radius={5}
                            fontColor={colors.cWhite}
                            borderWidth={2}
                            color={colors.color9}
                            backgroundColor={colors.color9}
                            loading={User?.loading}
                            onPress={onPress}
                        />
                    </View>
                ) :
                    (<BorderBtn
                        label={btnTitle ? btnTitle : language?.invited}
                        height={30} width={95}
                        fontSize={14} radius={5}
                        borderWidth={2}
                        disabled={btnDisable}
                        loading={User?.loading}
                        onPress={onPress}
                        color={showBorder ? colors.background : colors.color9}
                        fontColor={showBorder ? colors.btnText : colors.cWhite}
                        backgroundColor={showBorder ? colors.cWhite : colors.color9}
                    />)
                }
            </View>
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
        // color: colors.lightText,
        fontFamily: Fonts.Roboto_Regular
    }
})