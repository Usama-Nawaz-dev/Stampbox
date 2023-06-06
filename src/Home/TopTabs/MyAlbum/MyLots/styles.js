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

  search: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(5),
    marginTop: 15,
    borderWidth: 1,
    borderColor: "lightgrey",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 100,
  },
  leftSection: {
    flexDirection: "row",
    lignItems: "center",
  },
  input: {
    marginLeft: 10,
    fontFamily: "Roboto-Regular",
  },
});
