import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import AppText from "../AppText";
import colors from "../../constant/colors";
import FastImage from "react-native-fast-image";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import moment from "moment/moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ThemeContext from "../../src/Context/ThemeContext";

export const SuggestionCard = (props) => {
  const { onAction, item, showBtn } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme?.cardColor }]}>
      <View style={styles.topSection}>
        <AppText style={styles.timeText}>
          {moment(item?.created_at).fromNow()}
        </AppText>
        <FastImage
          style={styles.userIcon}
          source={{ uri: item?.user?.image_url }}
        />
        <View>
          <AppText style={styles.nameText}>{item?.user?.full_name}</AppText>
          <AppText style={styles.badgeText}>
            Mrs: {item?.user?.mrs_badge}
          </AppText>
        </View>
      </View>
      <View style={styles.line} />
      <AppText style={styles.itemText}>Suggestion for: {item?.key}</AppText>
      <AppText style={styles.infoText}>{item?.value}</AppText>
      <View style={styles.lowerSection}>
        <AppText style={styles.ownerText}>{item?.status}</AppText>
        {showBtn && item?.status === "Pending" && (
          <TouchableOpacity style={styles.icon} onPress={onAction}>
            <MaterialCommunityIcons
              name="list-status"
              size={24}
              color={theme?.black}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: wp(3),
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
  },
  topSection: {
    flexDirection: "row",
    paddingBottom: hp(0.5),
  },
  userIcon: {
    width: hp(6),
    height: hp(6),
    marginRight: wp(3),
    borderRadius: hp(10),
    backgroundColor: colors.background,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: hp(0.5),
    // color: colors.heading,
  },
  badgeText: {
    // color: colors.lightText,
  },
  timeText: {
    top: 0,
    right: 0,
    fontSize: 9,
    position: "absolute",
    // color: colors.lightText,
  },
  line: {
    maxWidth: wp(65),
    marginLeft: wp(12),
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    paddingTop: hp(0.5),
    // color: colors.heading,
  },
  infoText: {
    fontSize: 12,
    paddingTop: hp(0.5),
    // color: colors.lightText,
  },
  lowerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ownerText: {
    fontSize: 12,
    color: colors.green,
  },
  icon: {
    zIndex: 999,
    paddingLeft: wp(1),
  },
});
