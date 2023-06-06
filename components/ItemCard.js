import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View, Pressable } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useSelector } from "react-redux";
import CheckBox from "@react-native-community/checkbox";

import AppText from "./AppText";
import BorderBtn from "./BorderBtn";
import colors from "../constant/colors";

import Helper from "../src/Helper";
import Fonts from "../assets/fonts/Fonts";
import { images } from "../assets/images/Images";

import AuthContext from "../src/Context/AuthContext";
import ThemeContext from "../src/Context/ThemeContext";

export const ItemCard = (props) => {
  const {
    Item,
    onEdit,
    onShare,
    showBtn,
    onRemove,
    showRemove,
    onListPress,
    onViewDetail,
    onToggleCheck,
  } = props;

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const { theme, mood } = useContext(ThemeContext);

  const {
    myState: { language },
  } = useContext(AuthContext);

  let media_uri = Item?.medias[0]?.media_url;
  let stamp_status = Item?.status?.toString();

  const listChecker = () => {
    let list = [];
    if (Item?.is_attached_in_auctions >= 1) {
      list.push("Auction");
    }
    if (Item?.is_attached_in_supply >= 1) {
      list.push("Supplies");
    }
    if (Item?.is_attached_in_trades >= 1) {
      list.push("Trade");
    }
    if (Item?.is_wishable >= 1) {
      list.push("Wishlist");
    }
    if (list?.length) {
      return list;
    } else {
      return "Never";
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      <View style={styles.topText}>
        <AppText style={styles.leftText}>
          M{" "}
          {Item?.quantity_owned?.mint === null ? 0 : Item?.quantity_owned?.mint}
        </AppText>
        <AppText style={styles.rightText}>
          U{" "}
          {Item?.quantity_owned?.used === null ? 0 : Item?.quantity_owned?.used}
        </AppText>
      </View>
      {onToggleCheck ? (
        <View style={styles.checkBox}>
          <CheckBox
            size={18}
            lineWidth={2}
            boxType={"square"}
            value={Item?.isSelected}
            onFillColor={colors.cWhite}
            tintColor={colors.lightTheme}
            onTintColor={colors.lightTheme}
            onCheckColor={colors.lightTheme}
            onValueChange={onToggleCheck}
          />
        </View>
      ) : null}
      <View style={styles.iconSection}>
        {Item?.is_attached_in_trades ? (
          <View style={styles.iconContainer}>
            <Image
              resizeMode="contain"
              source={images.Trade}
              style={styles.topIcon}
              tintColor={colors.cWhite}
            />
          </View>
        ) : null}
        {Item?.is_attached_in_auctions ? (
          <View style={styles.iconContainer}>
            <Image
              resizeMode="contain"
              style={styles.topIcon}
              source={images.Auction}
              tintColor={colors.cWhite}
            />
          </View>
        ) : null}
      </View>
      <Image
        style={styles.stampImg}
        source={{
          uri: media_uri ? media_uri : "https://picsum.photos/600/600",
        }}
      />
      <AppText style={styles.listedText} numberOfLines={1}>
        {language?.listed}: {listChecker().toString()}
      </AppText>

      <Pressable style={styles.infoSection} onPress={onViewDetail}>
        <AppText style={styles.albumText} numberOfLines={1}>
          {Helper.capitalizeFirstLetter(Item?.name)}
        </AppText>
        <AppText style={styles.itemText} numberOfLines={1}>
          {language?.country}: {Item?.country ? Item?.country : "N/A"}
        </AppText>
        {Item?.catalogue_number?.length ? (
          <AppText style={styles.itemText} numberOfLines={1}>
            {language?.catalogue}:{" "}
            {Item?.catalogue_number[0]?.number
              ? Item?.catalogue_number[0]?.number
              : "N/A"}
          </AppText>
        ) : null}

        <AppText style={styles.itemText} numberOfLines={1}>
          {language?.status}: {stamp_status}
        </AppText>
      </Pressable>
      {!showBtn && (
        <View style={styles.bottomSection}>
          <BorderBtn
            height={hp(2.8)}
            bold={false}
            fontSize={10}
            width={wp(18)}
            borderWidth={1}
            color={"lightgrey"}
            label={language?.listIt}
            fontColor={colors.cBlack}
            fontFamily={Fonts.IBM_Regular}
            onPress={() =>
              currentUser?.store
                ? onListPress()
                : Helper.showToastMessage(
                    "Please create store for Listing.",
                    colors.blueTheme
                  )
            }
          />
          <TouchableOpacity
            // style={[styles.editIcon, { borderColor: theme?.black }]}
            onPress={onEdit}
          >
            {/* <Feather name="edit" size={hp(2)} color={theme?.davyGrey} /> */}
            <Image
              resizeMode="contain"
              source={images.EditIcon}
              tintColor={theme?.davyGrey}
              style={styles.shareIcon}
            />
          </TouchableOpacity>
          {Item?.albums?.length && showRemove ? (
            <TouchableOpacity onPress={onRemove}>
              <Image
                resizeMode="contain"
                source={images.Remove}
                tintColor={theme?.davyGrey}
                style={styles.shareIcon}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            // style={[styles.editIcon, { borderColor: theme?.black }]}
            onPress={onShare}
          >
            <Image
              resizeMode="contain"
              source={images.ShareIcon}
              tintColor={theme?.davyGrey}
              style={styles.shareIcon}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: wp(43),
    shadowColor: "#000",
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 7,
  },
  topText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(2),
    top: 1,
  },
  iconSection: {
    top: wp(4),
    right: wp(2),
    zIndex: 999,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  iconContainer: {
    padding: wp(1),
    borderRadius: 5,
    marginLeft: wp(1),
    backgroundColor: colors.lightTheme,
  },
  topIcon: {
    width: hp(1.5),
    height: hp(1.5),
    borderRadius: 5,
  },
  leftText: {
    fontSize: 10,
    color: "darkblue",
  },
  rightText: {
    fontSize: 10,
    color: "green",
  },
  stampImg: {
    height: hp(18),
    borderRadius: 5,
    resizeMode: "contain",
    marginVertical: hp(0.2),
    marginHorizontal: wp(2),
  },
  listedText: {
    fontSize: 10,
    paddingHorizontal: wp(2),
    // color: colors.lightText,
  },
  infoSection: {
    paddingTop: hp(0.5),
    borderTopWidth: 0.5,
    paddingBottom: hp(0.5),
    paddingHorizontal: wp(2),
    borderColor: colors.borderColor,
  },
  albumText: {
    fontSize: 14,
    marginBottom: hp(0.2),
    fontWeight: "500",
    // color: colors.lightBlack,
  },
  itemText: {
    marginTop: hp(0.2),
    fontSize: 11,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
    paddingVertical: hp(0.5),
    justifyContent: "space-around",
    borderColor: colors.borderColor,
  },
  editIcon: {
    width: hp(2.5),
    height: hp(2.5),
    borderWidth: 0.5,
    borderRadius: hp(10),
    alignItems: "center",
    justifyContent: "center",
  },
  shareIcon: {
    width: hp(2.2),
    height: hp(2.2),
  },
  bottomIcon: {
    width: hp(2.2),
    height: hp(2.2),
  },
  checkBox: {
    top: 16,
    zIndex: 999,
    left: wp(2),
    position: "absolute",
  },
});
