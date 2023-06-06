import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "./AppText";
import colors from "../constant/colors";
import UserCard from "../components/UserCard";
import { images } from "../assets/images/Images";

import { useSelector } from "react-redux";
import { TimeLeft } from "./TimeLeft";
import Fonts from "../assets/fonts/Fonts";
import { light as theme } from "../constant/colorsConfig";
import AuthContext from "../src/Context/AuthContext";

const ForTradeCard = (props) => {
  const { ItemDetail, type, onPressDetail } = props;
  const currentUser = useSelector((state) => state.ApiReducer.user);
  // console.log(" ItemDetail --> this", ItemDetail);
  const tradeables = ItemDetail?.tradeables ? ItemDetail?.tradeables[0] : null;
  const mediaUri = tradeables?.tradeable?.medias[0]?.media_url;
  const status = tradeables?.tradeable?.status?.toString();
  const owner = ItemDetail?.user?.id == currentUser?.id;
  const{myState:{language}}=useContext(AuthContext);
  // console.log(ItemDetail)
  return (
    <View style={styles.card}>
      <View>
        <Image style={styles.stampImg} source={{ uri: mediaUri }} />
      </View>
      <View style={styles.infoSection}>
        <AppText style={styles.stampId}>{ItemDetail?.uuid}</AppText>
        <AppText style={styles.nameText} numberOfLines={2}>
          {tradeables?.tradeable?.name}
        </AppText>

        <View>
          <AppText style={styles.text}>
            {language?.country}: {tradeables?.tradeable?.country}
          </AppText>
          <AppText style={styles.text}>
            Catalogue:{" "}
            {
              tradeables?.tradeable?.catalogue_number[0]
                ?.number
            }
          </AppText>
          <AppText numberOfLines={1} style={styles.text}>
            Status: {status}
          </AppText>
          <AppText numberOfLines={1} style={styles.text}>
            Accepting: <AppText style={[styles.text, { fontSize: 11 }]}>
              {ItemDetail?.accepting_offer}</AppText>
          </AppText>
        </View>

        <View style={styles.offerSection}>
          <AppText style={styles.offerText}>
            {ItemDetail?.trade_offers_count} {language?.offers}
          </AppText>
          <TouchableOpacity onPress={onPressDetail}
            style={styles.tradeBtn}>
            <AppText style={styles.tradeText}>
              {owner ? "Detail" : language?.tradeNow}
            </AppText>
          </TouchableOpacity>
        </View>

      </View>

      <TimeLeft
        fontSize={12}
        label={type == "expired" ? "Expired" : language?.endsIn}
        item={ItemDetail} noBid
        style={[styles.digitTxtStyle, styles.separator]}
      />
      <View style={{ paddingHorizontal: wp(2) }}>
        <UserCard starColor={colors.theme} User={ItemDetail?.user} />
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

export default ForTradeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
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
    width: 70,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.color8,
    borderRadius: 5,
  },
  tradeText: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.stayWhite,
  },
  timeContainer: {
    flexDirection: "row",
    // justifyContent: 'space-evenly',
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: wp(2),
  },
  timeText: {
    color: colors.theme,
    fontWeight: "600",
    fontSize: 11,
  },
  timeSection: {
    borderRightWidth: 2,
    borderColor: colors.theme,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  timeSection1: {
    paddingLeft: 3,
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
