import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import UserCard from "../../../../../components/UserCard";

import { useSelector } from "react-redux";
import Fonts from "../../../../../assets/fonts/Fonts";
import { TimeLeft, GradBtn } from "../../../../../components";
// import { light as theme } from "../../../../../constant/colorsConfig";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../constant/colorsConfig";

export const TradeTabCard = (props) => {
  const { ItemDetail, type, onPressDetail } = props;
  const currentUser = useSelector((state) => state.ApiReducer.user);
  // console.log(" ItemDetail --> this", ItemDetail);
  const tradeables = ItemDetail?.tradeables ? ItemDetail?.tradeables[0] : null;
  const mediaUri = tradeables?.tradeable?.medias[0]?.media_url;
  const status = tradeables?.tradeable?.status?.toString();
  const owner = ItemDetail?.user?.id == currentUser?.id;

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // console.log(ItemDetail)
  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor}]}>
      <View style={styles.mediaType}>
        <AppText style={styles.typeText}>
          {tradeables?.tradeable?.medias[0]?.type}
        </AppText>
      </View>
      <View>
        <Image style={styles.stampImg} source={{ uri: mediaUri }} />
      </View>
      <View style={[styles.infoSection, { backgroundColor: theme?.cardColor}]}>
        <AppText style={[styles.stampId, { color: theme?.theme }]}>{ItemDetail?.uuid}</AppText>
        <AppText style={[styles.nameText, { color: theme?.darkGrey}]} numberOfLines={2}>
          {tradeables?.tradeable?.name}
        </AppText>

        <View>
          <AppText style={styles.text}>
            {language?.country}:{" "}
            {tradeables?.tradeable?.country
              ? tradeables?.tradeable?.country
              : "N/A"}
          </AppText>
          <AppText style={styles.text}>
            {language?.catalogue}:{" "}
            {ItemDetail?.tradeables[0]?.tradeable?.catalogue_number[0]?.number
              ? ItemDetail?.tradeables[0]?.tradeable?.catalogue_number[0]
                  ?.number
              : "N/A"}
          </AppText>
          <AppText numberOfLines={1} style={styles.text}>
            {language?.status}: {status}
          </AppText>
          <AppText numberOfLines={1} style={styles.text}>
            {language?.accepting}:{" "}
            <AppText style={[styles.text, { fontSize: 11 }]}>
              {ItemDetail?.accepting_offer}
            </AppText>
          </AppText>
        </View>

        <View style={styles.offerSection}>
          <AppText style={[styles.offerText, { color: theme?.darkGrey}]}>
            {ItemDetail?.trade_offers_count} {language?.offers}
          </AppText>
          <GradBtn
            height={25}
            fontSize={12}
            fontWeight={"500"}
            style={styles.button}
            onPress={onPressDetail}
            width={owner ? wp(18) : wp(20)}
            label={owner ? language?.detail : language?.tradeNow}
          />
        </View>
      </View>

      <TimeLeft
        fontSize={12}
        label={type == "expired" ? language?.EXPIRED : language?.endsIn}
        item={ItemDetail}
        noBid
        digitColor={theme?.cardColor}
        style={[[styles.digitTxtStyle, { color: theme?.darkGrey}], [styles.separator, { color: theme?.darkGrey}]]}
      />

      <View style={styles.bottomSection}>
        <UserCard starColor={colors.theme} User={ItemDetail?.user} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
    width: wp(45),
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  mediaType: {
    height: 24,
    width: 55,
    zIndex: 999,
    top: wp(2),
    left: wp(2),
    borderRadius: 20,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(19,127,19, .6)",
  },
  typeText: {
    fontSize: 12,
    color: colors.background,
  },
  stampId: {
    fontSize: 12,
    fontWeight: "400",
    alignSelf: "center",
    color: colors.btnText,
  },
  stampImg: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoSection: {
    marginTop: -10,
    paddingHorizontal: wp(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.cWhite,
  },
  nameText: {
    marginBottom: 5,
    fontWeight: "500",
    color: colors.heading,
    fontFamily: Fonts.IBM_Regular,
  },
  text: {
    fontSize: 12,
    marginBottom: 2,
    // color: colors.heading,
  },
  offerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 3,
  },
  offerText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.heading,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.borderColor,
    paddingVertical: 5,
    paddingHorizontal: wp(2),
  },
  digitTxtStyle: {
    fontSize: 10,
    color: colors.heading,
    fontFamily: Fonts.Inter_Regular,
  },
  separator: {
    fontSize: 10,
    fontWeight: "400",
    color: colors.heading,
  },
  button: {
    marginTop: 0,
    marginBottom: 0,
  },
});
