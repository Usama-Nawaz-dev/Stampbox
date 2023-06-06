import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../constant/colors";
import Fonts from "../../../../assets/fonts/Fonts";
import AppText from "../../../../components/AppText";
import UserCard from "../../../../components/UserCard";
import { images } from "../../../../assets/images/Images";

import { useSelector } from "react-redux";
import { ImageBackground } from "react-native";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

const ItemCard = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const { item, onPressDetail, marginBottom } = props;
  const { theme } = useContext(ThemeContext);

  const {
    myState: { language },
  } = useContext(AuthContext);

  const {
    user: User,
    sale_price,
    regular_price,
    productable: { medias },
    parcel_detail: { weight },
  } = item;

  const owner = item?.user?.id == currentUser?.id;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme?.cardColor },
        marginBottom && { margin: 10, marginBottom },
      ]}
    >
      <View>
        {medias?.length ? (
          <ImageBackground
            imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
            style={[styles.stampImg]}
            source={{ uri: medias[0].media_url }}
          >
            <View
              style={[styles.stampImg, { backgroundColor: "rgba(0,0,0, 0.3)" }]}
            >
              <View style={styles.inStoke}>
                <Text style={{ color: "#fff" }}>{language?.inStoke}</Text>
              </View>
            </View>
          </ImageBackground>
        ) : (
          <ImageBackground
            imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
            style={[styles.stampImg]}
            source={images.noImg}
          >
            <View
              style={[styles.stampImg, { backgroundColor: "rgba(0,0,0, 0.3)" }]}
            >
              <View style={styles.inStoke}>
                <Text style={{ color: "#fff" }}>{language?.inStoke}</Text>
              </View>
            </View>
          </ImageBackground>
        )}
      </View>
      <View style={[styles.infoSection, { backgroundColor: theme?.cardColor }]}>
        <AppText style={[styles.stampId, { color: theme?.theme }]}>
          {item?.uuid}
        </AppText>
        <AppText style={styles.nameText} numberOfLines={1}>
          {item?.name}
        </AppText>
        <View>
          <AppText style={styles.text}>
            {language?.sku}: {item?.sku ? item?.sku : "N/A"}
          </AppText>
          <AppText style={styles.text}>
            {language?.weight}: {weight} lbs
          </AppText>
        </View>
        <View style={styles.offerSection}>
          {item?.accepting_best_offer ? (
            <AppText style={[styles.acceptText, { color: theme?.theme }]}>
              Accepting Best Offer
            </AppText>
          ) : (
            <AppText style={styles.offerText}>
              ${sale_price ? sale_price : regular_price}
            </AppText>
          )}
          <TouchableOpacity style={styles.tradeBtn} onPress={onPressDetail}>
            <AppText style={styles.tradeText}>
              {owner ? language?.detail : language?.buy + " " + language?.now}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.userSection, { backgroundColor: theme?.cardColor }]}>
        <UserCard User={User} starColor={colors.theme} />
      </View>
    </View>
  );
};

export default ItemCard;

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
    marginBottom: 5,
    fontWeight: "500",
    fontFamily: Fonts.IBM_Regular,
  },
  text: {
    fontSize: 12,
    marginBottom: hp(0.2),
  },
  infoText: {
    fontWeight: "400",
    color: colors.lightText,
    alignSelf: "center",
  },
  inStoke: {
    left: wp(2),
    top: hp(0.5),
    zIndex: 1000,
    height: hp(3),
    borderRadius: 20,
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
    backgroundColor: "rgba(13, 180, 185, .6)",
    paddingHorizontal: wp(1.5),
  },
  offerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(0.3),
  },
  offerText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.lightTheme,
  },
  acceptText: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.lightTheme,
  },
  tradeBtn: {
    padding: wp(1.3),
    paddingHorizontal: wp(2.5),
    backgroundColor: colors.lightTheme,
    borderRadius: 5,
  },
  tradeText: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.cWhite,
  },
  userSection: {
    marginTop: hp(1),
    marginBottom: hp(1),
    paddingHorizontal: wp(2),
  },
});
