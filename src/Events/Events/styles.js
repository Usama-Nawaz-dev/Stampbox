import { StyleSheet } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";

export const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  labelStyle: {
    fontSize: 14,
    textAlign: "center",
    textTransform: "none",
    fontFamily: Fonts.IBM_SemiBold,
  },
  guideIcon: {
    position: "absolute",
    top: hp(6),
    right: wp(12),
  },
  guideIcon1: {
    position: "absolute",
    top: hp(6),
    right: wp(3),
  },
});
