import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  detailsSection: {
    marginTop: hp(1),
  },
  uidText: {
    textAlign: "center",
    marginBottom: hp(1),
    color: colors.lightTheme,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.5),
    paddingHorizontal: wp(3),
  },
  infoContainer: {
    width: wp(30),
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoText: {
    marginTop: hp(0.5),
    fontSize: 12,
    // color: colors.lightText,
  },
  expiryText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: hp(1),
  },
  timeText: {
    fontSize: 14,
    color: colors.lightTheme,
    fontWeight: "400",
  },
  userSection: {
    marginTop: hp(1.5),
    paddingBottom: hp(0.5),
    paddingHorizontal: wp(3),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },
  itemHeading: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    marginBottom: hp(1),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  textStyle: {
    color: colors.theme,
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
  },
  commentBlock: {
    marginLeft: 5,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(81),
  },
  bottomSheetView: {
    padding: 20,
    justifyContent: "center",
    marginLeft: 10,
  },
  bottomSheetText: {
    fontSize: 20,
    marginLeft: 20,
  },
  bottomSheetOptionView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  labelStyle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    textTransform: "none",
    fontFamily: Fonts.IBM_Regular,
  },
  buySection: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    width: wp(80),
    alignSelf: "center",
  },
  button: {
    width: wp(35),
    marginTop: 0,
  },
  optionBtn: {
    width: hp(4),
    height: hp(4),
    backgroundColor: "#fff",
    borderRadius: hp(0.5),
    justifyContent: "center",
    alignItems: "center",
    right: wp(3),
  },
  guideIcon: {
    position: "absolute",
    top: hp(6),
    right: wp(3),
  },
  collectionSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },
  cText: {
    marginRight: wp(10),
  },
});
