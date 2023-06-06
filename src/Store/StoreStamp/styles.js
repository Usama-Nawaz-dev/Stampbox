import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "../../../assets/fonts/Fonts";

import colors from "../../../constant/colors";

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
  editStampCard: {
    width: hp(10),
    height: hp(10),
    borderWidth: 2,
    borderRadius: 5,
    marginTop: hp(1),
    marginLeft: hp(1.5),
  },
  crossIcon: {
    position: "absolute",
    alignSelf: "flex-end",
  },
  stampImg: {
    width: hp(5),
    height: hp(9),
    marginVertical: hp(0.3),
    alignSelf: "center",
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
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkSection: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: hp(1.5),
  },
  buyText: {
    marginLeft: wp(3),
    fontWeight: '500',
    // color: colors.lightBlack,
    fontFamily: Fonts.IBM_Regular,
  },
  priceHead: {
    marginTop: hp(1),
    color: colors.cBlack,
    fontFamily: Fonts.IBM_Medium,
  },
});
