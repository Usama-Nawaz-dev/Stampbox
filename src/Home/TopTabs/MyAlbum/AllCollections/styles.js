import { StyleSheet, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../../constant/colors";

const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  leftSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "50%",
    marginRight: 10,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
    marginTop: hp(2),
  },
  checkSection: {
    marginBottom: hp(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    // color: colors.lightText
  },
  addSection: {
    marginTop: height / 5,
    alignSelf: "center",
    alignItems: "center",
  },
  permissionCard: {
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 0.84,
    borderRadius: 7,
    padding: wp(2),
    marginTop: hp(1),
    backgroundColor: "#fff",
    marginHorizontal: wp(3),
  },
  limitText: {
    fontWeight: "500",
    color: colors.heading,
  },
  rowSection: {
    marginTop: hp(0.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  limitInfo: {
    fontSize: 12,
    color: colors.lightText,
  },
  subText: {
    color: colors.lightTheme,
  },
  upgradeBtn: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
  showText: {
    marginBottom: hp(0.5),
    paddingHorizontal: wp(3),
  },
  numText: {
    fontWeight: "600",
    color: colors.lightTheme,
  },
});
