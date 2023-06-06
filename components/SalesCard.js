import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Pressable } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "./AppText";
import { GradBtn } from "./GradBtn";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";
import UserCard from "../components/UserCard";
import { images } from "../assets/images/Images";

import Helper from "../src/Helper";
import { useSelector } from "react-redux";

import AuthContext from "../src/Context/AuthContext";
import ThemeContext from "../src/Context/ThemeContext";
// import { dark as theme } from "../constant/colorsConfig";

const SalesCard = (props) => {
  const {
    onBuyNow,
    gotoChat,
    ItemDetail,
    onPressFlag,
    onToggleFav,
    onPressUser,
  } = props;

  const currentUser = useSelector((state) => state.ApiReducer.user);
  // console.log(ItemDetail)
  const mediaType = ItemDetail?.productable?.medias[0]?.type
    ? ItemDetail?.productable?.medias[0]?.type
    : null;
  const mediaUri = ItemDetail?.productable?.medias[0]?.media_url;
  const owner = ItemDetail?.user?.id == currentUser?.id;
  const {
    myState: { language },
    openPermissionSheet,
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const canSeeDetail = currentUser?.user_permissions?.includes(
    "marketplace.buying.view_detail"
  );
  const canChat = currentUser?.user_permissions?.includes(
    "marketplace.buying.chat_with_seller"
  );

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      {mediaType && (
        <View style={styles.mediaType}>
          <AppText style={styles.typeText}>{mediaType}</AppText>
        </View>
      )}
      <View>
        {/* <AppText style={styles.stampId}>T735-83-6113</AppText> */}
        <Image style={styles.stampImg} source={{ uri: mediaUri }} />
        <Pressable style={styles.userCard} onPress={onPressUser}>
          <UserCard
            nameStyle={styles.userName}
            starColor={colors.cWhite}
            User={ItemDetail?.user}
            starSize={hp(1.5)}
            imgSize={hp(5)}
          />
        </Pressable>
      </View>
      <View style={styles.infoSection}>
        <AppText style={styles.nameText} numberOfLines={1}>
          {Helper.capitalizeFirstLetter(ItemDetail?.name)}
        </AppText>
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {language?.sku}: {ItemDetail?.sku ? ItemDetail?.sku : "N/A"}
        </AppText>
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {language?.weight}: {ItemDetail?.parcel_detail?.weight}lbs
        </AppText>
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {language?.qty}: {ItemDetail?.quantity}
        </AppText>
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {language?.status}: {ItemDetail?.status}
        </AppText>
        <View style={styles.buttonSection}>
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
            height={hp(3)}
            fontSize={10}
            fontWeight={"500"}
            style={styles.button}
            width={owner ? wp(16) : wp(18)}
            onPress={canSeeDetail ? onBuyNow : openPermissionSheet}
            label={
              owner ? language?.detail : language?.buy + " " + language?.now
            }
          />
        </View>
        {owner ? (
          <View style={styles.bottomSection}>
            <AppText style={{ fontWeight: "500", color: colors.green }}>
              {language?.owner}
            </AppText>
          </View>
        ) : (
          <View style={styles.bottomSection}>
            <TouchableOpacity
              onPress={canChat ? gotoChat : openPermissionSheet}
            >
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
            {/* <TouchableOpacity
              onPress={() =>
                Helper.showToastMessage("Comming Soon.", colors.blueTheme)
              }
            >
              <Image
                style={styles.icon}
                resizeMode="contain"
                source={images.Bookmark}
              />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={onPressFlag}>
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
    </View>
  );
};

export default SalesCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 7,
    padding: hp(1),
    margin: 1,
  },
  infoSection: {
    marginLeft: wp(3),
    width: wp(46),
  },
  stampId: {
    zIndex: 999,
    marginTop: hp(16),
    alignSelf: "center",
    position: "absolute",
    color: colors.cWhite,
    textShadowColor: "#000",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  stampImg: {
    width: wp(40),
    height: hp(22),
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  userCard: {
    bottom: hp(1),
    position: "absolute",
    alignSelf: "center",
    zIndex: 999,
  },
  buttonSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
  },
  priceText: {
    color: colors.theme,
    fontSize: 18,
    fontWeight: "700",
  },
  bidButton: {
    height: hp(3),
    width: wp(22),
    borderRadius: 5,
    backgroundColor: colors.background,
  },
  nameText: {
    fontSize: 16,
    maxWidth: wp(50),
    fontWeight: "500",
    marginTop: hp(0.5),
    marginBottom: hp(0.5),
    fontFamily: Fonts.IBM_Regular,
  },
  infoText: {
    fontSize: 13,
    marginBottom: hp(0.3),
    color: colors.lightText,
  },
  userName: {
    fontSize: 12,
    color: colors.cWhite,
    textShadowColor: "#000",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: hp(0.5),
    width: "100%",
  },
  icon: {
    width: hp(2.2),
    height: hp(2.2),
  },
  button: {
    marginTop: 0,
    marginBottom: 0,
  },
  offerText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.lightTheme,
  },
  offerText1: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
  mediaType: {
    top: wp(4),
    left: wp(3),
    zIndex: 999,
    height: hp(2.6),
    borderRadius: 20,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(19,127,19, .6)",
    paddingHorizontal: wp(1.5),
  },
  typeText: {
    fontSize: 12,
    color: colors.background,
  },
});
