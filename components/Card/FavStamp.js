import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View, Pressable } from "react-native";
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

export const FavStamp = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const { Item, onPress, onToggleFav, onPressUser } = props;
  const {
    myState: { language },
  } = useContext(AuthContext);

  const owner = currentUser?.id === Item?.user?.id;
  let media_uri = Item?.medias[0]?.media_url;
  let stamp_status = Item?.status?.toString();
  const listChecker = () => {
    if (Item?.is_attached_in_auctions === 1) {
      return "Auction";
    } else if (Item?.is_attached_in_supply === 1) {
      return "Supplies";
    } else if (Item?.is_attached_in_trades === 1) {
      return "Trade";
    } else if (Item?.is_wishable === 1) {
      return "Wishlist";
    } else {
      return "Never";
    }
  };
  return (
    <View style={styles.card}>
      <View style={styles.topText}>
        <AppText style={styles.leftText}>
          M{" "}
          {Item?.quantity_owned?.mint === "null"
            ? 0
            : Item?.quantity_owned?.mint}
        </AppText>
        <AppText style={styles.rightText}>
          U{" "}
          {Item?.quantity_owned?.used === "null"
            ? 0
            : Item?.quantity_owned?.used}
        </AppText>
      </View>
      <Image
        style={styles.stampImg}
        source={{
          uri: media_uri ? media_uri : "https://picsum.photos/600/600",
        }}
      />
      <AppText style={styles.listedText}>
        {language?.listed}: {listChecker()}
      </AppText>
      <View style={styles.infoSection}>
        <AppText style={styles.albumText} numberOfLines={1}>
          {Helper.capitalizeFirstLetter(Item?.name)}
        </AppText>
        <AppText style={styles.itemText}>
          {language?.country}: {Item?.country}
        </AppText>
        {Item?.catalogue_number?.length ? (
          <AppText style={styles.itemText}>
            Catalogue: {Item?.catalogue_number[0]?.number}
          </AppText>
        ) : null}

        <AppText style={styles.itemText} numberOfLines={1}>
          Status: {stamp_status}
        </AppText>
        {/* <AppText style={styles.esvText}>ESV: <AppText style={{ color: colors.red }}>0</AppText></AppText> */}
      </View>
      <View style={styles.btnSection}>
        <BorderBtn
          label={"View Stamp"}
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
      <Pressable style={styles.bottomSection} onPress={onPressUser}>
        <UserCard starColor={colors.theme} User={Item?.user} />
      </Pressable>
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
  topText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(2),
    top: 1,
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
    marginHorizontal: 10,
    marginVertical: 2,
    resizeMode: "contain",
  },
  listedText: {
    paddingHorizontal: wp(2),
    fontSize: 10,
    color: colors.lightText,
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
