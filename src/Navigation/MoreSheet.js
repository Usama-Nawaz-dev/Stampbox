import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import FastImage from "react-native-fast-image";

import AppText from "../../components/AppText";
import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import { images } from "../../assets/images/Images";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ThemeContext from "../Context/ThemeContext";

export const MoreSheet = ({ onPress }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <AppText style={styles.heading}>More Menu</AppText>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.subSection}
          onPress={() => onPress("Notify")}
        >
          <FastImage
            source={images.Notify}
            tintColor={theme?.black}
            style={styles.icon}
            resizeMode="contain"
          />
          <AppText style={[styles.subHeading, { color: theme?.black }]}>
            Notification
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress(false, "TradeStack")}
          style={styles.subSection}
        >
          <FastImage
            source={images.Trade}
            tintColor={theme?.black}
            style={styles.icon}
            resizeMode="contain"
          />
          <AppText style={[styles.subHeading, { color: theme?.black }]}>
            Trade
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress(false, "MyAuctions")}
          style={styles.subSection}
        >
          <FastImage
            source={images.Auction}
            tintColor={theme?.black}
            style={styles.icon}
            resizeMode="contain"
          />
          <AppText style={[styles.subHeading, { color: theme?.black }]}>
            Auction
          </AppText>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.subSection}>
          <Image
            source={images.Bounty}
            style={styles.icon}
            resizeMode="contain"
          />
          <AppText style={styles.subHeading}>Bounties</AppText>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp(0.5),
    paddingHorizontal: wp(3),
  },
  heading: {
    fontSize: 18,
    fontFamily: Fonts.IBM_SemiBold,
    // color: colors.lightBlack,
  },
  section: {
    paddingHorizontal: wp(3),
    marginTop: hp(1.2),
  },
  subSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  icon: {
    width: hp(3),
    height: hp(3),
  },
  subHeading: {
    marginLeft: wp(5),
    color: colors.lightText,
  },
});
