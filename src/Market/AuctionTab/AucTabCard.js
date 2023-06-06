import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Pressable } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import UserCard from "../../../components/UserCard";
import { images } from "../../../assets/images/Images";
import Btn from "../../../components/Btn";
import { TimeLeft } from "../../../components";

import Helper from "../../Helper";
import { useSelector } from "react-redux";
import AuthContext from "../../Context/AuthContext";
import Fonts from "../../../assets/fonts/Fonts";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

export const AucTabCard = (props) => {
  const {
    ItemDetail,
    onBidNow,
    onPressUser,
    onBuyNow,
    onPressDetail,
    onPressFlag,
    gotoChat,
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
  } = useContext(AuthContext);
  const { openPermissionSheet } = useContext(AuthContext);
  const canChat = currentUser?.user_permissions?.includes(
    "marketplace.buying.chat_with_seller"
  );
  const canUserBid = currentUser?.user_permissions?.includes(
    "marketplace.auctions.bidding_access"
  );

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
            uri: mediaUri ? mediaUri : "https://picsum.photos/600/600",
          }}
        />
      </View>
      <View style={[styles.infoSection, { backgroundColor: theme?.cardColor }]}>
        <AppText style={[styles.stampId, { color: theme?.theme }]}>
          {ItemDetail?.uuid}
        </AppText>
        <AppText style={styles.nameText} numberOfLines={1}>
          {ItemDetail?.auctionable?.name}
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
      </View>
      {owner ? (
        <View style={[styles.buttonSection, { alignSelf: "center" }]}>
          <Btn
            label="Details"
            fontSize={10}
            textColor={colors.cWhite}
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
              textColor={colors.cWhite}
              style={styles.bidButton}
              iconLeft={
                <Image
                  source={require("../../../assets/icons/buy.png")}
                  tintColor={colors.cWhite}
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
            fontSize={10}
            label="Bid Now"
            textColor={colors.cWhite}
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
                source={require("../../../assets/icons/bid.png")}
                tintColor={colors.cWhite}
                style={styles.btnImg}
              />
            }
          />
        </View>
      )}
      <TimeLeft
        fontSize={12}
        marginLeft={wp(2)}
        marginTop={-hp(0.5)}
        label={ItemDetail?.is_expired ? "Expired" : language?.endsIn}
        item={ItemDetail}
        noBid
        style={[
          {
            fontSize: 10,
            color: theme?.darkGrey,
            fontFamily: Fonts.Inter_Regular,
          },
          {
            fontSize: 10,
            fontWeight: "400",
            color: theme?.darkGrey,
          },
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
              tintColor={theme?.darkGrey}
              source={images.Comments}
            />
          </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  card: {
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
    color: colors.lightTheme,
    alignSelf: "center",
  },
  stampImg: {
    height: hp(18),
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoSection: {
    marginTop: -hp(1.2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: wp(2),
    backgroundColor: colors.cWhite,
  },
  nameText: {
    fontWeight: "500",
    marginBottom: hp(0.5),
    // color: colors.heading,
    fontFamily: Fonts.IBM_Regular,
  },
  infoText: {
    fontSize: 12,
    // color: colors.lightText,
  },
  btnImg: {
    height: 10,
    width: 10,
    resizeMode: "contain",
    marginRight: wp(0.5),
  },
  bottomSection: {
    height: hp(4),
    borderTopWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    borderColor: colors.borderColor,
    paddingHorizontal: wp(2),
    marginTop: hp(1),
  },
  icon: {
    width: hp(2),
    height: hp(2),
  },
  buttonSection: {
    marginTop: hp(0.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  bidButton: {
    height: hp(3),
    width: wp(20),
    borderRadius: 5,
    backgroundColor: colors.lightTheme,
  },
  bidButton1: {
    height: hp(3),
    width: wp(30),
    borderRadius: 5,
    backgroundColor: colors.lightTheme,
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
  userSection: {
    marginTop: hp(-0.5),
    paddingHorizontal: wp(2),
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
