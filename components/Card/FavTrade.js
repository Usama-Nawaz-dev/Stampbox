import React, { useContext, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Ionicons from "react-native-vector-icons/Ionicons";
import BorderBtn from "../BorderBtn";

import AppText from "../AppText";
import UserCard from "../UserCard";
import Helper from "../../src/Helper";
import colors from "../../constant/colors";

import { useSelector } from "react-redux";
import AuthContext from "../../src/Context/AuthContext";

export const FavTrade = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const { Item, onPress, onToggleFav } = props;

  const {
    myState: { language },
  } = useContext(AuthContext);

  const owner = currentUser?.id === Item?.user?.id;

  const tradeItem = Item?.tradeables?.length ? Item?.tradeables[0] : false;
  const currentTrade = tradeItem?.tradeable ? tradeItem?.tradeable : false;

  console.log(Item);

  const media_uri = currentTrade?.medias?.length
    ? currentTrade?.medias[0]?.media_url
    : null;

  const tradeStatus = currentTrade?.status?.toString();
  return (
    <View style={styles.card}>
      <Image
        style={styles.stampImg}
        source={{
          uri: media_uri ? media_uri : "https://picsum.photos/600/600",
        }}
      />

      <View style={styles.infoSection}>
        <AppText style={styles.albumText} numberOfLines={1}>
          {Helper.capitalizeFirstLetter(currentTrade?.name)}
        </AppText>
        <AppText style={styles.itemText}>
          {language?.country}:{" "}
          {currentTrade?.country ? currentTrade?.country : "N/A"}
        </AppText>
        {currentTrade?.catalogue_number?.length ? (
          <AppText style={styles.itemText}>
            Catalogue:{" "}
            {currentTrade?.catalogue_number[0]?.number
              ? currentTrade?.catalogue_number[0]?.number
              : "N/A"}
          </AppText>
        ) : null}

        <AppText style={styles.itemText} numberOfLines={1}>
          Status: {tradeStatus}
        </AppText>
        <AppText numberOfLines={1} style={styles.itemText}>
          Accepting:{" "}
          <AppText style={[styles.itemText, { fontSize: 11 }]}>
            {Item?.accepting_offer}
          </AppText>
        </AppText>
      </View>
      <View style={styles.btnSection}>
        <BorderBtn
          label={"Trade Detail"}
          width={wp(30)}
          height={23}
          color={"lightgrey"}
          fontColor={colors.cBlack}
          fontSize={10}
          bold={false}
          borderWidth={1}
          onPress={onPress}
        />
        {!owner && (
          <TouchableOpacity onPress={onToggleFav}>
            <Ionicons
              name={Item?.is_wishable ? "heart" : "heart-outline"}
              color={colors.color8}
              size={22}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.bottomSection}>
        <UserCard starColor={colors.theme} User={Item?.user} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: wp(43),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: "lightgrey",
  },
  stampImg: {
    height: hp(18),
    marginHorizontal: 10,
    marginVertical: 2,
    resizeMode: "contain",
  },
  infoSection: {
    paddingHorizontal: wp(2),
    paddingTop: 10,
    paddingBottom: 5,
    borderTopWidth: 0.5,
    // borderBottomWidth: 0.5,
    borderColor: "lightgrey",
  },
  albumText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  itemText: {
    color: colors.lightText,
    marginTop: 2,
    fontSize: 11,
  },
  esvText: {
    fontSize: 12,
    color: colors.lightText,
    alignSelf: "center",
    marginTop: 5,
  },
  bottomSection: {
    marginVertical: 5,
    paddingHorizontal: wp(3),
  },
  btnSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 0.5,
    borderColor: "lightgrey",
    paddingBottom: 5,
  },
});
