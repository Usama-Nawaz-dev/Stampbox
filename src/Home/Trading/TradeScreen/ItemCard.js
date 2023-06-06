import React, { useContext } from "react";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Image from "react-native-fast-image";
import AppText from "../../../../components/AppText";
import UserCard from "../../../../components/UserCard";
import colors from "../../../../constant/colors";
import { images } from "../../../../assets/images/Images";

import { useSelector, useDispatch } from "react-redux";

import { TimeLeft } from "../../../../components";
import AuthContext from "../../../Context/AuthContext";

const ItemCard = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const { Item, onPress } = props;
  // console.log(Item)
  const mediaUri = Item?.tradeables[0]?.tradeable?.medias[0]?.media_url;
  const status = Item?.tradeables[0]?.tradeable?.status?.toString();
  const owner = Item?.user?.id == currentUser?.id;
  const {
    myState: { language },
  } = useContext(AuthContext);

  return (
    <View style={styles.card}>
      <View>
        <ImageBackground
          imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
          style={[styles.stampImg]}
          source={{ uri: mediaUri }}
        >
          <View
            style={[styles.stampImg, { backgroundColor: "rgba(0,0,0, 0.1)" }]}
          />
        </ImageBackground>
      </View>
      <View style={styles.infoSection}>
        <AppText style={styles.stampId}>{Item?.uuid}</AppText>
        <AppText style={styles.nameText} numberOfLines={2}>
          {Item?.tradeables[0]?.tradeable?.name}
        </AppText>
        <View>
          <AppText style={styles.text} numberOfLines={1}>
            {language?.country}: {Item?.tradeables[0]?.tradeable?.country}
          </AppText>
          <AppText style={styles.text} numberOfLines={1}>
            Catalogue:{" "}
            {Item?.tradeables[0]?.tradeable?.catalogue_number[0]?.number}
          </AppText>
          <AppText numberOfLines={1} style={styles.text}>
            Status: {status}
          </AppText>
        </View>
        <View style={styles.offerSection}>
          <AppText style={styles.offerText}>
            {Item?.trade_offers_count} {language?.offers}
          </AppText>
          <TouchableOpacity
            onPress={onPress}
            style={[styles.tradeBtn, { backgroundColor: colors.color8 }]}
          >
            {owner ? (
              <AppText style={styles.tradeText}>Detail</AppText>
            ) : (
              <AppText style={styles.tradeText}>{language?.tradeNow}</AppText>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <TimeLeft
        fontSize={12}
        label={language}
        item={Item}
        noBid
        style={[styles.digitTxtStyle, styles.separator]}
      />
      <View style={{ paddingHorizontal: wp(2) }}>
        <UserCard starColor={colors.theme} User={Item?.user} />
      </View>
      {owner ? (
        <View style={styles.bottomSection}>
          <AppText style={{ fontWeight: "500", color: colors.green }}>
            {language?.owner}
          </AppText>
        </View>
      ) : (
        <View style={styles.bottomSection}>
          <TouchableOpacity>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={images.Comments}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={images.Heart}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={images.Bookmark}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={images.Flag}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ItemCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
    margin: 1,
    width: wp(45),
    shadowColor: "#000",
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
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoSection: {
    marginTop: -10,
    backgroundColor: colors.cWhite,
    paddingHorizontal: wp(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  nameText: {
    fontFamily: "IBMPlexSans-Regular",
    fontWeight: "500",
    color: colors.heading,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 2,
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
    marginTop: 3,
  },
  offerText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.theme,
  },
  tradeBtn: {
    width: 80,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
  },
  tradeText: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.white,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.borderColor,
    paddingVertical: 10,
    paddingHorizontal: wp(2),
    marginTop: 10,
  },
  icon: {
    width: 15,
    height: 15,
  },
  digitTxtStyle: {
    fontFamily: Fonts.Inter_Regular,
    fontSize: 10,
    color: colors.theme,
  },
  separator: {
    color: colors.theme,
    fontSize: 10,
    fontWeight: "400",
  },
});
