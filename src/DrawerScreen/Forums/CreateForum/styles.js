import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Fonts from "../../../../assets/fonts/Fonts";
import colors from "../../../../constant/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  scroll: {
    paddingHorizontal: wp(5),
  },
  inputText: {
    fontSize: 12,
    marginTop: 15,
    marginBottom: 5,
    // color: colors.placeholderText
  },
  descriptionInput: {
    height: 100,
    fontSize: 14,
    padding: 10,
    borderRadius: 7,
    borderWidth: 1,
    color: colors.btnText,
    borderColor: colors.borderColor,
    fontFamily: Fonts.IBM_Regular,
  },
  btnStyle: {
    alignSelf: "center",
    marginTop: 30,
  },
});
