import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import { color } from "react-native-reanimated";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  mediaSection: {
    backgroundColor: colors.background,
  },
  description: {
    marginTop: hp(1.5),
    color: colors.btnText,
    fontFamily: Fonts.Inter_Regular,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    // color: colors.heading,
    marginVertical: hp(0.5),
  },
  detailsSection: {
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
  priceText: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.lightTheme,
    fontFamily: Fonts.Inter_Regular,
  },
  shippingText: {
    fontSize: 10,
    fontWeight: "400",
    color: colors.btnText,
    fontFamily: Fonts.Inter_Regular,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
    marginTop: hp(1),
    paddingBottom: hp(1.5),
  },
  lowerSection: {
    paddingTop: hp(1.5),
    marginBottom: hp(30),
  },
  itemHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.lightBlack,
    paddingHorizontal: wp(3),
  },
  cartButton: {
    width: wp(94),
    marginTop: hp(0.5),
    marginBottom: hp(1.5),
  },
  offerCard: {
    height: 165,
    width: 150,
    borderRadius: 10,
    justifyContent: "center",
    overflow: "hidden",
    marginHorizontal: 5,
  },
  offCardText: {
    fontSize: 14,
    fontWeight: "400",
    color: "green",
  },
  offCardTextView: {
    paddingHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 2,
    marginRight: wp(3),
  },
  parcelDetail: {
    flexDirection: "row",
    width: wp(95),
    alignItems: "center",
    backgroundColor: colors.background,
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 7,
    padding: 10,
    justifyContent: "space-between",
  },
  parcelValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.lightText,
  },
  labelStyle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    textTransform: "none",
    fontFamily: Fonts.IBM_Regular,
  },

  counter: {
    position: "absolute",
    right: 0,
    top: 0,
    borderRadius: hp(10),
    backgroundColor: colors.color8,
  },
  counterText: {
    fontSize: 10,
    paddingHorizontal: 3,
    color: colors.cWhite,
  },

  // Info ItemStyles
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  keyText: {
    width: "35%",
    fontSize: 14,
    // color: colors.lightBlack
  },
  valueText: {
    fontSize: 14,
    maxWidth: wp(62),
    // color: colors.lightText
  },
});
