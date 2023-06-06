import { StyleSheet } from "react-native";
import colors from "../../constant/colors";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  btnSection: {
    flexDirection: "row",
  },
  emptyText: {
    fontSize: 16,
    color: colors.lightTheme,
  },
  loader: {
    height: hp(5),
    marginVertical: hp(1.5),
  },
  emptySection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  upperSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginVertical: hp(1.5),
    paddingHorizontal: wp(3),
  },
  optionIcon: {
    width: hp(2.8),
    height: hp(2.8),
    marginTop: -hp(1.5),
    resizeMode: "contain",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontWeight: "500",
    marginRight: wp(2),
  },

  //Notify Comp
  mainSection: {
    borderBottomWidth: 0.5,
    borderColor: colors.borderColor,
  },
  conatiner: {
    height: hp(8),
    alignItems: "center",
    flexDirection: "row",
    // borderBottomWidth: 0.5,
    paddingHorizontal: wp(3),
    // borderColor: colors.borderColor,
  },
  userImg: {
    width: hp(6),
    height: hp(6),
    marginRight: wp(3),
    borderRadius: hp(10),
    backgroundColor: colors.borderColor,
  },
  heading: {
    fontSize: 14,
    fontWeight: "500",
    // color: colors.heading,
  },
  info: {
    fontSize: 14,
    maxWidth: wp(80),
    // color: colors.heading
  },
  timeText: {
    fontSize: 12,
    color: colors.lightText,
  },
  dotIcon: {
    zIndex: 999,
    top: hp(0.5),
    left: wp(1.5),
    position: "absolute",
  },
  btnContainer: {
    width: 50,
    height: "100%",
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
    backgroundColor: colors.light,
    borderColor: colors.borderColor,
    borderBottomWidth: 0.5,
  },
  upperView: {},
});
