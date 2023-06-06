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
  coverSection: {
    marginTop: hp(2),
    marginHorizontal: wp(5),
  },
  inputSection: {
    marginTop: hp(2),
    paddingHorizontal: wp(5),
  },
  inputText: {
    fontSize: 12,
    marginBottom: 5,
    marginTop: hp(2),
    color: colors.lightText
  },
  descriptionInput: {
    height: hp(13),
    fontSize: 14,
    padding: hp(1),
    paddingTop: hp(1),
    borderRadius: 7,
    borderWidth: 1,
    color: colors.btnText,
    borderColor: colors.borderColor,
    fontFamily: Fonts.IBM_Regular,
  },
  checkSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1.5),
  },
  buyText: {
    marginLeft: wp(3),
    color: colors.placeholderText,
    fontFamily: Fonts.Roboto_Regular,
  },
  stampCard: {
    borderWidth: 2,
    borderRadius: 5,
    width: hp(11.5),
    height: hp(11.5),
    marginRight: wp(3),
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.lightTheme,
  },
  stampImg: {
    height: hp(9.5),
    width: hp(9.5),
  },
  listStyle: {
    paddingTop: hp(2),
    paddingHorizontal: wp(5),
  },

  //Image Picker Modal
  centeredView: {
    width: wp(50),
    marginTop: hp(35),
    alignSelf: "center",
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 7,
  },
  modalView: {
    padding: wp(2),
  },
  headingText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: hp(1),
    alignSelf: "center",
  },
  modalText: {
    fontSize: 12,
    marginTop: hp(0.5),
    alignSelf: "center",
    color: "grey",
  },
  cancelButton: {
    fontSize: 11,
    color: "red",
    fontWeight: "500",
    alignSelf: "center",
    marginTop: hp(1),
    marginBottom: hp(1),
  },
});
