import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "../../assets/fonts/Fonts";

import colors from "../../constant/colors";

export const styles = StyleSheet.create({
  scroll: {
    width: "90%",
    alignSelf: "center",
    marginBottom: hp(2),
  },
  mediaSection: {
    marginTop: hp(2.5),
    marginLeft: 5,
  },
  mediaText: {
    fontSize: 16,
    fontFamily: Fonts.IBM_Medium,
  },
  addStampCard: {
    width: hp(9),
    height: hp(9),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    marginTop: hp(1),
  },
  itemPicker: {
    marginTop: hp(1),
  },
  inputText: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.btnText,
    fontFamily: Fonts.Roboto_Regular,
  },
  tagSection: {
    flex: 1,
    justifyContent: "space-between",
    height: 140,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  listSection: {
    marginTop: 5,
    paddingLeft: 5,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  inputSection: {
    flex: 0.3,
    justifyContent: "center",
  },
  tagInput: {
    width: "95%",
    backgroundColor: colors.background,
    fontFamily: "Roboto-Regular",
    alignSelf: "center",
    padding: 8,
    borderRadius: 5,
    color: colors.btnText,
    fontSize: 10,
  },
});
