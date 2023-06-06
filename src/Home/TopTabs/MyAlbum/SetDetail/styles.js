import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../../constant/colors";
import Fonts from "../../../../../assets/fonts/Fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  leftText: {
    fontSize: 16,
    marginTop: hp(2),
    fontWeight: "500",
    paddingHorizontal: wp(3),
    color: colors.lightBlack,
  },
  infoCard: {
    padding: wp(2),
    marginTop: hp(1),
    shadowColor: "#000",
    marginHorizontal: wp(3),
    paddingHorizontal: wp(3),
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    paddingBottom: hp(2.5),
    shadowOpacity: 0.2,
    shadowRadius: 0.8,
    borderRadius: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.cBlack,
    marginTop: hp(0.3),
  },
  infoText: {
    fontWeight: "400",
    color: colors.lightText,
  },
  description: {
    fontSize: 12,
    marginTop: hp(0.5),
    color: colors.lightText,
  },
  heading: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.lightBlack,
    paddingHorizontal: wp(3),
    marginVertical: hp(1),
  },
  mainItem: {
    marginTop: hp(15),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
});
