import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Pressable } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";

import AppText from "./AppText";
import Helper from "../src/Helper";
import { GradBtn } from "./GradBtn";
import { TimeLeft } from "./TimeLeft";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";
import UserCard from "../components/UserCard";
import { images } from "../assets/images/Images";

import AuthContext from "../src/Context/AuthContext";
import ThemeContext from "../src/Context/ThemeContext";

const TradeCard = (props) => {
  const { closeSheet, openPermissionSheet } = useContext(AuthContext);
  const canChat = currentUser?.user_permissions?.includes(
    "marketplace.buying.chat_with_seller"
  );

  const {
    ItemDetail,
    onPressFlag,
    onPressUser,
    onToggleFav,
    onPressDetail,
    onToggleBookmark,
  } = props;

  const currentUser = useSelector((state) => state.ApiReducer.user);

  const stampTrade = ItemDetail?.tradeables
    ? ItemDetail?.tradeables[0]?.tradeable
    : null;

  const mediaUri = stampTrade?.medias[0]?.media_url;
  const owner = ItemDetail?.user?.id == currentUser?.id;
  const mediaType = stampTrade?.medias[0]?.type
    ? stampTrade?.medias[0]?.type
    : null;

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

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
        <AppText style={styles.stampId}>{ItemDetail?.uuid}</AppText>
        <AppText style={styles.nameText} numberOfLines={1}>
          {Helper.capitalizeFirstLetter(stampTrade?.name)}
        </AppText>
        <View>
          <AppText style={styles.text} numberOfLines={1}>
            {language?.country}:{" "}
            {stampTrade.country ? stampTrade.country : "N/A"}
          </AppText>
          <AppText style={styles.text} numberOfLines={1}>
            Catalogue:{" "}
            {stampTrade.catalogue_number[0]?.number
              ? stampTrade?.catalogue_number[0]?.number
              : "N/A"}
          </AppText>
          <AppText numberOfLines={1} style={styles.text}>
            Status: {stampTrade?.status?.toString()}
          </AppText>
          <AppText numberOfLines={1} style={styles.text}>
            Accepting:{" "}
            <AppText style={[styles.text, { fontSize: 11 }]}>
              {ItemDetail?.accepting_offer}
            </AppText>
          </AppText>
        </View>
        <View style={styles.offerSection}>
          <AppText style={styles.offerText}>
            {ItemDetail?.trade_offers_count} {language?.offers}
          </AppText>
          <GradBtn
            height={hp(3)}
            fontSize={10}
            fontWeight={"500"}
            style={styles.button}
            width={owner ? wp(18) : wp(20)}
            label={owner ? "Details" : language?.tradeNow}
            onPress={() =>
              currentUser?.store
                ? onPressDetail()
                : Helper.showToastMessage(
                    "Please create your store first.",
                    colors.blueTheme
                  )
            }
          />
        </View>
      </View>
      <TimeLeft
        fontSize={12}
        marginLeft={wp(2)}
        marginTop={-hp(0.5)}
        label={false == "expired" ? "Expired" : language?.endsIn}
        item={ItemDetail}
        noBid
        style={[
          [styles.digitTxtStyle, { color: theme?.iridium }],
          [styles.separator, { color: theme?.black }],
        ]}
      />
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
          <AppText style={{ color: colors.green, fontWeight: "500" }}>
            {language?.owner}
          </AppText>
        </View>
      ) : (
        <View style={styles.bottomSection}>
          <TouchableOpacity
            onPress={() =>
              canChat
                ? Helper.showToastMessage("Coming Soon.", colors.blueTheme)
                : openPermissionSheet()
            }
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
          <TouchableOpacity onPress={onToggleBookmark}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              tintColor={theme?.darkGrey}
              source={
                ItemDetail?.is_book_marked ? images.Bookmark1 : images.Bookmark
              }
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressFlag}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              tintColor={theme?.darkGrey}
              source={
                stampTrade?.flag_tickets_count > 0 ? images.Flag1 : images.Flag
              }
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TradeCard;

const styles = StyleSheet.create({
  card: {
    width: wp(45),
    backgroundColor: colors.cWhite,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  mediaType: {
    top: wp(2),
    left: wp(2),
    zIndex: 999,
    height: hp(2.4),
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
  stampId: {
    fontSize: 12,
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
    backgroundColor: colors.cWhite,
    paddingHorizontal: wp(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  nameText: {
    fontWeight: "500",
    fontFamily: Fonts.IBM_Regular,
  },
  text: {
    fontSize: 12,
  },
  infoText: {
    fontWeight: "400",
    color: colors.lightText,
    alignSelf: "center",
  },
  offerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(0.3),
  },
  offerText: {
    fontSize: 13,
    fontWeight: "500",
    // color: colors.heading,
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
  },
  digitTxtStyle: {
    fontSize: 10,
    // color: colors.heading,
    fontFamily: Fonts.Inter_Regular,
  },
  separator: {
    fontSize: 10,
    fontWeight: "400",
    // color: colors.heading,
  },
  button: {
    marginTop: 0,
    marginBottom: 0,
  },
  userSection: {
    marginTop: hp(-0.5),
    paddingHorizontal: wp(2),
  },
});
