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
  card: {
    width: wp(96),
    shadowColor: "#000",
    alignSelf: "center",
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 7,
    marginVertical: hp(1),
  },
  stampImg: {
    height: hp(22),
    borderRadius: 5,
  },
  infoSection: {
    paddingHorizontal: wp(2),
    paddingVertical: wp(0.5),
  },
  titleText: {
    fontSize: 16,
    marginBottom: hp(0.2),
    color: colors.lightTheme,
    fontFamily: Fonts.IBM_SemiBold,
  },
  itemText: {
    marginTop: hp(0.2),
    fontSize: 13,
  },
  biView: {
    width: "96%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
   
  },
  uncheck: {
    height: hp(2),
    width: hp(2),
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.borderColor
  },
  radioItems: {
    margin: wp(2),
    flexDirection: "row",
    alignItems: "center",
  },
  cross: {
    zIndex: 100,
    top: -hp(1.8),
    right: -wp(1),
    width: hp(3.5),
    height: hp(3.5),
    borderRadius: hp(10),
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  main: {
    width: "95%",
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: "center",
    borderColor: colors.borderColor,
  },
});
