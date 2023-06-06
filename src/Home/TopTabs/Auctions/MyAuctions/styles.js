import { StyleSheet, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../../constant/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff'
  },
  labelStyle: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    paddingHorizontal: 5,
    textTransform: "none",
  },
  guideIcon: {
    position: "absolute",
    top: hp(5),
    right: wp(5),
  },
  badgeSection: {
    width: hp(1.8),
    height: hp(1.8),
    marginTop: hp(1),
    borderRadius: hp(10),
    marginRight: wp(0.5),
    backgroundColor: colors.lightTheme,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 8,
    color: colors.cWhite,
  },
});
