import { StyleSheet } from "react-native";

import colors from "../../../constant/colors";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "../../../assets/fonts/Fonts";

export const styles = StyleSheet.create({
  container: {
    width: wp(100),
    backgroundColor: colors.cWhite,
  },
  bgImage: {
    height: hp(8),
    justifyContent: "center",
  },
  topSection: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wp(4),
    justifyContent: "space-between",
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 18,
    fontFamily: Fonts.IBM_Medium,
    color: colors.cWhite,
    marginLeft: wp(3),
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  counterSection: {
    height: hp(2.2),
    width: hp(2.2),
    borderRadius: 10,
    backgroundColor: colors.theme,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -hp(1),
    right: -wp(3),
    zIndex: 999,
  },
  counterText: {
    color: "#fff",
    fontSize: 9,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  locationText: {
    marginHorizontal: 3,
    color: colors.disable,
  },
  searchContainer: {
    width: wp(100),
    marginTop: -25,
    flexDirection: "row",
    paddingHorizontal: wp(3),
    alignItems: "center",
    justifyContent: "space-between",
    opacity: 0.95,
  },
  searchSection: {
    height: 45,
    width: wp(80),
    backgroundColor: colors.cWhite,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.borderColor,
  },
  filterSection: {
    width: 45,
    height: 45,
    backgroundColor: colors.cWhite,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.borderColor,
  },
  input: {
    fontFamily: "Inter-Regular",
    marginLeft: 10,
  },
  iconStyle: {
    height: hp(2.8),
    width: hp(2.8),
    tintColor: colors.cWhite,
  },
});
