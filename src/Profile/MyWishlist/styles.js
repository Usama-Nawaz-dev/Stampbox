import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  labelStyle: {
    fontSize: 14,
    textAlign: "center",
    textTransform: "none",
    paddingHorizontal: wp(3),
    fontFamily: "Roboto-Regular",
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.theme,
    fontWeight: "500",
  },

  //Album Tab Styles
  addButton: {
    position: "absolute",
    backgroundColor: colors.color8,
    bottom: 40,
    right: wp(6),
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  listStyle: {
    paddingHorizontal: wp(5),
  },
});
