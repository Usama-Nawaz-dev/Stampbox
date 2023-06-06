import { StyleSheet } from "react-native";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  mainItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme
  },

  // Card Styles
  card: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.cWhite,
    marginTop: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 5,
    padding: 7,
    paddingHorizontal: wp(6),
  },
  itemSection: {
    alignItems: "center",
  },
  heading: {
    fontSize: 12,
    fontWeight: "500",
    // color: colors.lightBlack,
  },
  value: {
    fontSize: 12,
    // color: colors.lightBlack,
    marginTop: hp(0.5),
  },
});
