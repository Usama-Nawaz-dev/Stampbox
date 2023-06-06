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
  addSection: {
    marginTop: height / 3,
    alignSelf: "center",
    alignItems: "center",
  },
  addButton: {
    width: hp(6),
    zIndex: 999,
    height: hp(6),
    right: wp(6),
    bottom: hp(4.5),
    position: "absolute",
    alignItems: "center",
    borderRadius: hp(10),
    justifyContent: "center",
    backgroundColor: colors.lightTheme,
  },
});
