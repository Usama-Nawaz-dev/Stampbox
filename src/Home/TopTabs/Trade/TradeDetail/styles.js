import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Fonts from "../../../../../assets/fonts/Fonts";
import colors from "../../../../../constant/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mediaSection: {
    marginBottom: hp(1),
    backgroundColor: colors.background,
  },
  detailsSection: {
    marginTop: hp(2.5),
    paddingHorizontal: wp(3),
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.5),
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    width: "50%",
    color: colors.cBlack,
  },
  infoText: {
    fontWeight: "400",
    color: colors.lightText,
  },
  expiryText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: hp(1),
    marginBottom: hp(1.5),
    color: colors.lightText,
    paddingHorizontal: wp(3),
  },
  timeText: {
    color: colors.danger,
    fontWeight: "400",
  },
  heading: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
    // color: colors.lightBlack,
    paddingHorizontal: wp(3),
  },
  offerSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },
  offerText: {
    // fontWeight: '500',
    marginTop: hp(0.5),
    // color: colors.lightBlack,
  },
  offerText1: {
    fontWeight: "400",
    marginTop: hp(0.5),
    // color: colors.lightText,
  },
  userSection: {
    paddingTop: hp(2),
    paddingHorizontal: wp(3),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: wp(3),
  },
  upperSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImg: {
    width: hp(4.8),
    height: hp(4.8),
    borderRadius: hp(10),
  },
  nameSection: {
    marginLeft: hp(1),
  },
  ownerText: {
    fontSize: 10,
    // color: 'grey',
  },
  lowerSection: {
    marginTop: hp(2),
    paddingHorizontal: wp(3),
    marginBottom: hp(3),
  },
  itemHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: hp(1),
    color: colors.heading,
    fontFamily: Fonts.IBM_Regular,
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelStyle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    textTransform: "none",
    fontFamily: Fonts.IBM_Regular,
  },
  edit: {
    padding: hp(1),
    borderRadius: hp(10),
    backgroundColor: `${colors.cWhite}20`,
  },
  toggleIcons: {
    height: 30,
    width: 30,
  },
  guideIcon: {
    position: "absolute",
    top: hp(6),
    right: wp(3),
  },
});
