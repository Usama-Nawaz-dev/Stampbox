import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { GradBtn } from "../../../components";
import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import AppText from "../../../components/AppText";
import UserCard from "../../../components/UserCard";
import { images } from "../../../assets/images/Images";

import Helper from "../../Helper";
import { Pressable } from "react-native";
import { useSelector } from "react-redux";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const SuppliesCard = (props) => {
  const { ItemDetail, onFlag, onPressBtn, onPressUser, gotoChat, onToggleFav } =
    props;

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const { closeSheet, openPermissionSheet } = useContext(AuthContext);

  const mediaType = ItemDetail?.productable?.medias[0]?.type
    ? ItemDetail?.productable?.medias[0]?.type
    : null;
  const mediaUri = ItemDetail?.productable?.medias[0]?.media_url;
  const status = ItemDetail?.productable?.status?.toString();
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const owner = ItemDetail?.user?.id == currentUser?.id;

  const canSeeDetail = currentUser?.user_permissions?.includes(
    "marketplace.buying.view_detail"
  );
  const canChat = currentUser?.user_permissions?.includes(
    "marketplace.buying.chat_with_seller"
  );
  const canSeeUser = currentUser?.user_permissions?.includes(
    "marketplace.buying.seller_information"
  );

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      {mediaType && (
        <View style={styles.mediaType}>
          <AppText style={styles.typeText}>{mediaType}</AppText>
        </View>
      )}
      <View>
        <Image style={styles.stampImg} source={{ uri: mediaUri }} />
      </View>
      <View style={[styles.infoSection, { backgroundColor: theme?.cardColor }]}>
        <AppText style={[styles.stampId, { color: theme?.theme }]}>
          {ItemDetail?.uuid}
        </AppText>
        <AppText style={styles.nameText} numberOfLines={1}>
          {Helper.capitalizeFirstLetter(ItemDetail?.name)}
        </AppText>
        <AppText style={[styles.text, { color: theme?.lightText }]}>
          {language?.sku}: {ItemDetail?.sku ? ItemDetail?.sku : "N/A"}
        </AppText>
        <AppText style={[styles.text, { color: theme?.lightText }]}>
          {language?.weight}: {ItemDetail?.parcel_detail?.weight}lbs
        </AppText>
        <AppText style={[styles.text, { color: theme?.lightText }]}>
          {language?.type}: {ItemDetail?.productable_type}
        </AppText>
        <View style={styles.offerSection}>
          {ItemDetail?.sale_price ? (
            <AppText style={[styles.offerText, { color: theme?.theme }]}>
              ${ItemDetail?.sale_price}
            </AppText>
          ) : (
            <AppText style={[styles.offerText1, { color: theme?.theme }]}>
              {language?.acceptingOffers}
            </AppText>
          )}
          <GradBtn
            fontSize={10}
            height={hp(3)}
            fontWeight={"500"}
            onPress={onPressBtn}
            style={styles.button}
            width={owner ? wp(16) : wp(18)}
            label={owner ? "Details" : "Buy Now"}
          />
        </View>
      </View>
      <Pressable onPress={onPressUser} style={styles.userSection}>
        <UserCard
          imgSize={hp(4)}
          starSize={hp(1.5)}
          User={ItemDetail?.user}
          starColor={colors.theme}
        />
      </Pressable>
      {owner ? (
        <View style={styles.bottomSection}>
          <AppText style={{ fontWeight: "500", color: colors.green }}>
            {language?.owner}
          </AppText>
        </View>
      ) : (
        <View style={styles.bottomSection}>
          <TouchableOpacity onPress={canChat ? gotoChat : openPermissionSheet}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              tintColor={theme?.darkGrey}
              source={images.Comments}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onToggleFav}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              tintColor={theme?.darkGrey}
              source={ItemDetail?.is_wishable ? images.Heart1 : images.Heart}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onFlag}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              tintColor={theme?.darkGrey}
              source={images.Flag}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 1,
    width: wp(45),
    shadowColor: "#000",
    backgroundColor: colors.cWhite,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    borderRadius: 10,
  },
  stampId: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.theme,
    alignSelf: "center",
  },
  stampImg: {
    width: "100%",
    height: hp(18),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoSection: {
    marginTop: -hp(1),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: wp(2),
    backgroundColor: colors.cWhite,
  },
  nameText: {
    fontFamily: Fonts.IBM_Regular,
    marginBottom: hp(0.5),
    fontWeight: "500",
  },
  text: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: hp(0.2),
  },
  offerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(0.3),
  },
  offerText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.lightTheme,
  },
  offerText1: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.lightTheme,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderColor: colors.borderColor,
    paddingHorizontal: wp(2),
    borderTopWidth: 1,
    marginTop: hp(1),
    height: hp(4.5),
  },
  icon: {
    width: hp(2),
    height: hp(2),
    tintColor: "#ffff",
  },
  button: {
    marginTop: 0,
    marginBottom: 0,
  },
  userSection: {
    marginTop: hp(0.5),
    paddingHorizontal: wp(2),
  },
  mediaType: {
    top: wp(2),
    left: wp(2),
    zIndex: 999,
    height: hp(2.6),
    borderRadius: 20,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(1.5),
    backgroundColor: "rgba(19,127,19, .6)",
  },
  typeText: {
    fontSize: 12,
    color: colors.background,
  },
});
