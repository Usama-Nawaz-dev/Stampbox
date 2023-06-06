import React, { useContext, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Pressable } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";

import AppText from "./AppText";
import Helper from "../src/Helper";
import Btn from "../components/Btn";
import { TimeLeft } from "./TimeLeft";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";
import UserCard from "../components/UserCard";
import { images } from "../assets/images/Images";

import AuthContext from "../src/Context/AuthContext";
import ThemeContext from "../src/Context/ThemeContext";

const AuctionCard = (props) => {
  const {
    onBidNow,
    onBuyNow,
    gotoChat,
    ItemDetail,
    onPressFlag,
    onPressUser,
    onPressDetail,
    backgroundColor,
  } = props;
  const { theme } = useContext(ThemeContext);
  const currentUser = useSelector((state) => state.ApiReducer.user);

  let mediaUri = null;
  let mediaType = null;

  if (ItemDetail?.auctionable_type === "Album") {
    mediaUri = ItemDetail?.auctionable?.image_url
      ? ItemDetail?.auctionable?.image_url
      : null;
  } else {
    mediaUri = ItemDetail?.auctionable?.medias?.length
      ? ItemDetail?.auctionable?.medias[0]?.media_url
      : null;

    mediaType = ItemDetail?.auctionable?.medias?.length
      ? ItemDetail?.auctionable?.medias[0]?.type
      : null;
  }

  const owner = ItemDetail?.user?.id == currentUser?.id;
  const canBuy = 1;

  const {
    myState: { language },
    openPermissionSheet,
  } = useContext(AuthContext);
  const canChat = currentUser?.user_permissions?.includes(
    "marketplace.buying.chat_with_seller"
  );
  const canUserBid = currentUser?.user_permissions?.includes(
    "marketplace.auctions.bidding_access"
  );

  return (
    <LinearGradient
      style={styles.card}
      colors={backgroundColor ? backgroundColor : ["#585755", "#3B3B3B"]}
    >
      <View>
        {/* <AppText style={styles.stampId}>T735-83-6113</AppText> */}
        {mediaType && (
          <View style={styles.mediaType}>
            <AppText style={styles.typeText}>{mediaType}</AppText>
          </View>
        )}
        <Image style={styles.stampImg} source={{ uri: mediaUri }} />
        <Pressable
          onPress={() => {
            if (onPressUser) {
              onPressUser();
            }
          }}
          style={styles.userCard}
        >
          <UserCard
            imgSize={hp(4.5)}
            starSize={hp(1.5)}
            User={ItemDetail?.user}
            starColor={colors.cWhite}
            nameStyle={styles.userName}
          />
        </Pressable>
      </View>
      <View style={styles.infoSection}>
        <AppText style={styles.nameText} numberOfLines={1}>
          {Helper.capitalizeFirstLetter(ItemDetail?.auctionable?.name)}
        </AppText>
        <AppText style={styles.infoText}>
          {language?.totalBids}: {ItemDetail?.bids_count}
        </AppText>
        <AppText style={styles.infoText}>
          Intial Bid: {ItemDetail?.initial_bid}
        </AppText>
        <AppText style={styles.infoText}>
          {language?.buyingPrice}: {ItemDetail?.price}
        </AppText>
        <AppText style={styles.infoText}>Status: {ItemDetail?.status}</AppText>
        {owner ? (
          <View style={[styles.buttonSection, { alignSelf: "center" }]}>
            <Btn
              fontSize={10}
              label={language?.details}
              textColor={colors.btnText}
              style={styles.bidButton1}
              onPress={onPressDetail}
            />
          </View>
        ) : (
          <View style={styles.buttonSection}>
            {ItemDetail?.can_buy_now == canBuy ? (
              <Btn
                label="Buy Now"
                fontSize={10}
                textColor={colors.btnText}
                style={styles.bidButton}
                iconLeft={
                  <Image
                    source={require("../assets/icons/buy.png")}
                    tintColor={colors.btnText}
                    style={styles.btnImg}
                  />
                }
                onPress={() =>
                  currentUser?.store
                    ? canUserBid
                      ? onBuyNow()
                      : openPermissionSheet()
                    : Helper.showToastMessage(
                        "Please create your store first.",
                        colors.blueTheme
                      )
                }
              />
            ) : null}

            <Btn
              label="Bid Now"
              fontSize={10}
              textColor={colors.btnText}
              style={styles.bidButton}
              onPress={() =>
                currentUser?.store
                  ? canUserBid
                    ? onBidNow()
                    : openPermissionSheet()
                  : Helper.showToastMessage(
                      "Please create your store first.",
                      colors.blueTheme
                    )
              }
              iconLeft={
                <Image
                  source={require("../assets/icons/bid.png")}
                  tintColor={colors.btnText}
                  style={styles.btnImg}
                />
              }
            />
          </View>
        )}
        <TimeLeft
          noBid
          fontSize={12}
          item={ItemDetail}
          marginLeft={wp(0)}
          labelColor={colors.white}
          label={ItemDetail?.is_expired ? "Expired" : language?.endsIn}
          digitColor={
            backgroundColor ? backgroundColor : ["#585755", "#3B3B3B"]
          }
          style={[
            {
              fontSize: 12,
              color: colors.cWhite,
              fontFamily: Fonts.Inter_Regular,
            },
            {
              fontSize: 12,
              fontWeight: "400",
              color: colors.cWhite,
            },
          ]}
        />
        {owner ? (
          <View style={styles.bottomSection}>
            <AppText style={{ fontWeight: "500", color: colors.green }}>
              {language?.owner}
            </AppText>
          </View>
        ) : (
          <View style={styles.bottomSection}>
            <TouchableOpacity
              onPress={() => (canChat ? gotoChat() : openPermissionSheet())}
            >
              <Image
                style={styles.icon}
                resizeMode="contain"
                tintColor={colors.cWhite}
                source={images.Comments}
              />
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() =>
                Helper.showToastMessage("Coming Soon.", colors.blueTheme)
              }
            >
              <Image
                style={styles.icon}
                resizeMode="contain"
                tintColor={colors.cWhite}
                source={require("../assets/icons/heart.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Helper.showToastMessage("Coming Soon.", colors.blueTheme)
              }
            >
              <Image
                style={styles.icon}
                resizeMode="contain"
                tintColor={colors.cWhite}
                source={require("../assets/icons/bookmark.png")}
              />
            </TouchableOpacity> */}

            <TouchableOpacity onPress={onPressFlag}>
              <Image
                style={styles.icon}
                resizeMode="contain"
                tintColor={colors.cWhite}
                source={images.Flag}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default AuctionCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 7,
    padding: hp(1),
  },
  infoSection: {
    marginLeft: wp(2),
  },
  stampId: {
    color: colors.cWhite,
    position: "absolute",
    zIndex: 999,
    alignSelf: "center",
    marginTop: hp(16),
    textShadowColor: "#000",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  stampImg: {
    width: wp(40),
    height: 190,
    backgroundColor: "red",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  userCard: {
    position: "absolute",
    bottom: hp(1),
    alignSelf: "center",
  },
  buttonSection: {
    marginTop: hp(0.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bidButton: {
    height: hp(3),
    width: wp(20),
    borderRadius: 5,
    backgroundColor: colors.background,
  },
  bidButton1: {
    height: hp(3),
    width: wp(30),
    borderRadius: 5,
    backgroundColor: colors.background,
  },
  nameText: {
    fontSize: 16,
    marginBottom: hp(0.5),
    maxWidth: wp(40),
    fontWeight: "500",
    color: colors.cWhite,
    fontFamily: Fonts.IBM_Regular,
  },
  infoText: {
    fontSize: 13,
    marginBottom: hp(0.2),
    color: colors.borderColor,
  },
  userName: {
    fontSize: 12,
    color: colors.cWhite,
    textShadowColor: "#000",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  btnImg: {
    width: hp(1.4),
    height: hp(1.4),
    marginRight: hp(0.3),
    resizeMode: "contain",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // position: "absolute",
    // bottom: hp(0.5),
    // width: "100%",
  },
  icon: {
    width: hp(2.4),
    height: hp(2.4),
  },
  digitTxtStyle: {
    fontSize: 12,
    fontFamily: Fonts.Inter_Regular,
  },
  separator: {
    fontSize: 12,
    fontWeight: "400",
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
