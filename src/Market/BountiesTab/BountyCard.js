import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Pressable } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";

import Helper from "../../Helper";
import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import AppText from "../../../components/AppText";
import UserCard from "../../../components/UserCard";
import { images } from "../../../assets/images/Images";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const BountyCard = (props) => {
  const { ItemDetail, onPressHunt, onPressUser, onFlag, gotoChat } = props;
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const mediaType = ItemDetail?.medias[0]?.type
    ? ItemDetail?.medias[0]?.type
    : null;
  const media_uri = ItemDetail?.medias[0]?.media_url;
  const owner = ItemDetail?.user?.id == currentUser?.id;

  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { closeSheet, openPermissionSheet } = useContext(AuthContext);
  const canUserHunt = currentUser?.user_permissions?.includes(
    "marketplace.bounty.hunting"
  );
  const canChat = currentUser?.user_permissions?.includes(
    "marketplace.buying.chat_with_seller"
  );

  function kFormatter(num) {
    return `${
      Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
        : Math.sign(num) * Math.abs(num)
    }`;
  }

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      {mediaType && (
        <View style={styles.mediaType}>
          <AppText style={styles.typeText}>{mediaType}</AppText>
        </View>
      )}
      <View>
        <Image
          style={styles.stampImg}
          source={{
            uri: media_uri ? media_uri : "https://picsum.photos/600/600",
          }}
        />
      </View>
      <View style={[styles.infoSection, { backgroundColor: theme?.cardColor }]}>
        <AppText style={[styles.stampId, { color: theme?.theme }]}>
          {ItemDetail?.uuid}
        </AppText>
        <AppText style={styles.nameText} numberOfLines={1}>
          {ItemDetail?.title
            ? Helper.capitalizeFirstLetter(ItemDetail?.title)
            : "Deutsche Bundespost Rare Stamp 1931"}
        </AppText>
        <View>
          <AppText style={[styles.text, { color: theme?.lightText }]}>
            {language?.bountyOffered}: $
            {ItemDetail?.offered_amount ? ItemDetail?.offered_amount : 0}
          </AppText>
          <AppText style={[styles.text, { color: theme?.lightText }]}>
            {language?.country}:{" "}
            {ItemDetail?.country ? ItemDetail?.country : "N/A"}
          </AppText>
          <AppText
            style={[styles.text, { color: theme?.lightText }]}
            numberOfLines={1}
          >
            {language?.condition}:{" "}
            {ItemDetail?.condition?.length
              ? ItemDetail?.condition.toString()
              : "N/A"}
          </AppText>
          <AppText
            style={[styles.text, { color: theme?.lightText }]}
            numberOfLines={1}
          >
            {language?.Format}:{" "}
            {ItemDetail?.format?.length ? ItemDetail?.format.toString() : "N/A"}
          </AppText>
        </View>
        <View style={styles.offerSection}>
          <AppText style={styles.offerText}>
            {kFormatter(ItemDetail?.offered_coins)}
            <AppText style={styles.coinText}> Coins Offered</AppText>
          </AppText>
          <TouchableOpacity
            style={styles.bidBtn}
            onPress={canUserHunt ? onPressHunt : openPermissionSheet}
          >
            <Image
              source={require("../../../assets/icons/bid.png")}
              tintColor={colors.cWhite}
              style={styles.btnImg}
            />
            <AppText style={styles.tradeText}>
              {owner ? language?.detail : language?.hunt}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
      <Pressable
        onPress={onPressUser}
        style={{ paddingHorizontal: wp(2), marginTop: hp(0.5) }}
      >
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
        <TouchableOpacity
          style={styles.bottomSection}
          onPress={() => (canChat ? gotoChat() : openPermissionSheet())}
        >
          {/* <TouchableOpacity onPress={() =>
            canChat ?
              Helper.showToastMessage("Comming Soon", colors.blueTheme) :
              openPermissionSheet()
          }> */}
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={images.Comments}
          />
          {/* </TouchableOpacity> */}
          <AppText style={{ marginLeft: 5 }}>Chat With User</AppText>
          {/* <TouchableOpacity onPress={() =>
            Helper.showToastMessage("Comming Soon", colors.blueTheme)}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={images.Heart}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
            Helper.showToastMessage("Comming Soon", colors.blueTheme)}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={images.Bookmark}
            />
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={onFlag}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={images.Flag}
            />
          </TouchableOpacity> */}
        </TouchableOpacity>
      )}
    </View>
  );
};

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
    fontWeight: "500",
    color: colors.theme,
    alignSelf: "center",
  },
  stampImg: {
    width: "100%",
    height: hp(17),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoSection: {
    marginTop: -hp(1),
    backgroundColor: colors.cWhite,
    paddingHorizontal: wp(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  nameText: {
    fontWeight: "500",
    marginBottom: hp(0.5),
    fontFamily: Fonts.IBM_Regular,
  },
  text: {
    fontSize: 12,
    marginBottom: hp(0.2),
    color: colors.lightText,
  },
  infoText: {
    fontWeight: "400",
    alignSelf: "center",
    color: colors.lightText,
  },
  offerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItemDetails: "center",
    marginTop: hp(0.3),
  },
  offerText: {
    fontWeight: "700",
    color: colors.theme,
  },
  coinText: {
    fontSize: 10,
    color: colors.heading,
    fontWeight: "400",
  },
  bidBtn: {
    padding: wp(1.3),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
    backgroundColor: colors.lightTheme,
    borderRadius: 5,
  },
  btnImg: {
    width: hp(1.2),
    height: hp(1.2),
    marginRight: wp(1.5),
    resizeMode: "contain",
  },
  tradeText: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.cWhite,
  },
  bottomSection: {
    flexDirection: "row",
    // justifyContent: "space-around",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    height: hp(4),
    borderColor: colors.borderColor,
    paddingHorizontal: wp(2),
    marginTop: hp(1),
  },
  icon: {
    width: hp(2),
    height: hp(2),
  },
  mediaType: {
    zIndex: 999,
    top: wp(2),
    left: wp(2),
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
