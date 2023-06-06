import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";

import AppText from "../AppText";
import UserCard from "../UserCard";
import Helper from "../../src/Helper";
import BorderBtn from "../BorderBtn";
import colors from "../../constant/colors";
import AuthContext from "../../src/Context/AuthContext";

import { useSelector } from "react-redux";

export const FavProduct = (props) => {
  const {
    myState: { language },
  } = useContext(AuthContext);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const { Item, onPress, onToggleFav, btnTitle } = props;
  const owner = currentUser?.id === Item?.user?.id;
  let media_uri = Item?.productable?.medias[0]?.media_url;
  const price = Item?.sale_price ? Item?.sale_price : Item?.regular_price;

  console.log(Item);

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
          {Item?.name && Helper.capitalizeFirstLetter(Item?.name)}
        </AppText>
        <AppText style={styles.itemText}>
          {language?.sku}: {Item?.sku}
        </AppText>
        <AppText style={styles.itemText}>
          Weight: {Item?.parcel_detail?.weight}lbs
        </AppText>
        <AppText style={styles.itemText} numberOfLines={1}>
          Price:{" "}
          <AppText style={styles.priceText}>
            {Item?.accepting_best_offer ? "Acceptin Best Offers" : `$${price}`}
          </AppText>
        </AppText>
      </View>
      <View style={styles.btnSection}>
        <BorderBtn
          label={btnTitle ? btnTitle : "View Product"}
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
    marginHorizontal: 5,
    marginVertical: 5,
    resizeMode: "contain",
    borderRadius: 5,
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
  priceText: {
    fontWeight: "600",
    color: colors.color8,
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
