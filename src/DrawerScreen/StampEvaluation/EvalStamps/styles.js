import { StyleSheet, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../constant/colors";
import Fonts from "../../../../assets/fonts/Fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  upperSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: wp(3),
  },
  rightSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // width: wp(18),
  },
  leftText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: wp(3),
  },
  icon: {
    backgroundColor: colors.background,
    borderRadius: 7,
    padding: wp(1.4),
  },
  filterIcon: {
    height: hp(4),
    borderRadius: 7,
    paddingHorizontal: wp(1.4),
    backgroundColor: colors.background,
  },
  //Empty List
  mainItem: {
    width: wp(100),
    flex: 1,
    backgroundColor: colors.cWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    // color: colors.lightText
  },
  bottomButton: {
    position: "absolute",
    bottom: hp(2.5),
  },
});
