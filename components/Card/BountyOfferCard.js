import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import FastImage from "react-native-fast-image";

import AppText from "../AppText";
import colors from "../../constant/colors";
import { images } from "../../assets/images/Images";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import moment from "moment";
import Fonts from "../../assets/fonts/Fonts";
import Helper from "../../src/Helper";

export const BountyOfferCard = (props) => {
  const { onPress, ItemDetail, onViewDetail, onChat } = props;

  let uri;
  let itemName;
  let createdAt;

  if (ItemDetail?.referable) {
    createdAt = moment(ItemDetail?.created_at).format("YYYY-MM-DD [at] h:mm a");
    if (ItemDetail?.referable?.medias) {
      uri = ItemDetail?.referable?.medias[0]?.media_url;
      itemName = ItemDetail?.referable?.name;
    } else if (ItemDetail?.referable?.tradeables) {
      uri =
        ItemDetail?.referable?.tradeables[0]?.tradeable?.medias[0]?.media_url;
      itemName = ItemDetail?.referable?.tradeables[0]?.tradeable?.name;
    } else if (ItemDetail?.referable?.auctionable) {
      itemName = ItemDetail?.referable?.auctionable?.name;
      if (ItemDetail?.referable?.auctionable?.type === "Lot") {
        uri = ItemDetail?.referable?.auctionable?.image_url;
      } else {
        uri = ItemDetail?.referable?.auctionable?.medias[0]?.media_url;
      }
    } else if (ItemDetail?.referable?.productable) {
      uri = ItemDetail?.referable?.productable?.medias[0]?.media_url;
      itemName = ItemDetail?.referable?.productable?.name;
    } else {
      uri = null;
      itemName = "Dummy Data";
    }
  } else if (ItemDetail) {
    createdAt = moment(ItemDetail?.created_at).format("YYYY-MM-DD [at] h:mm a");
    if (ItemDetail?.bounty) {
      itemName = "Default Value";
      uri = null;
    }
  }

  return !ItemDetail?.referral_link ? (
    <View style={styles.card} onPress={onPress}>
      <TouchableOpacity style={styles.chatIcon} onPress={onChat}>
        <FastImage
          style={styles.commentIcon}
          tintColor={colors.cBlack}
          source={images.Comments}
          resizeMode={"contain"}
        />
      </TouchableOpacity>
      <Pressable onPress={onViewDetail}>
        <FastImage
          source={uri ? { uri: uri } : images.noImg}
          style={styles.stampImg}
        />
      </Pressable>
      <View style={{ marginLeft: wp(3) }}>
        <AppText style={styles.title} numberOfLines={2}>
          {Helper.capitalizeFirstLetter(itemName)}
        </AppText>
        <AppText style={styles.text}>{createdAt}</AppText>
        <AppText style={styles.otherText}>
          Status: <AppText style={styles.text}>{ItemDetail?.status}</AppText>
        </AppText>
        <AppText style={styles.otherText} numberOfLines={3}>
          {ItemDetail?.description}
        </AppText>
      </View>
    </View>
  ) : (
    <View style={[styles.card, styles.linkCard]}>
      <AppText style={styles.linkText}>{ItemDetail?.referral_link}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    padding: wp(2),
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 7,
    height: hp(13),
    width: "100%",
  },
  linkCard: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageSection: {
    flexDirection: "row",
  },
  stampImg: {
    width: hp(11),
    height: hp(11),
    borderRadius: 5,
  },
  title: {
    fontSize: 14,
    maxWidth: wp(65),
    fontFamily: Fonts.IBM_Medium,
  },
  text: {
    fontSize: 12,
    maxWidth: wp(65),
    marginTop: hp(0.3),
    color: colors.lightTheme,
    fontFamily: Fonts.IBM_Regular,
  },
  linkText: {
    color: colors.blueTheme,
    textDecorationLine: "underline",
  },
  otherText: {
    fontSize: 12,
    maxWidth: wp(65),
    marginTop: hp(0.3),
    color: colors.lightText,
  },
  commentIcon: {
    height: hp(2.5),
    width: hp(2.5),
  },
  chatIcon: {
    position: "absolute",
    right: wp(3),
    top: hp(1),
  },
});
