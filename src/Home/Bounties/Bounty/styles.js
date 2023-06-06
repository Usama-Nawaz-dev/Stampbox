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
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 18,
    // color: colors.lightBlack,
    fontFamily: Fonts.IBM_Medium,
  },
  detailsSection: {
    // marginTop: hp(2.5),
    paddingHorizontal: wp(3),
  },
  uidText: {
    textAlign: "center",
    color: colors.lightTheme,
    fontFamily: Fonts.IBM_Regular,
  },
  description: {
    fontSize: 16,
    // color: colors.lightBlack,
    fontFamily: Fonts.IBM_Medium,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.5),
  },
  infoContainer: {
    width: wp(32),
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    // color: colors.lightBlack,
    fontFamily: Fonts.IBM_Medium,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    maxWidth: wp(70),
    color: colors.lightText,
    fontFamily: Fonts.IBM_Regular,
  },
  offerText: {
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: wp(3),
    // color: colors.lightBlack,
    fontFamily: Fonts.IBM_SemiBold,
  },
  sellerInfo: {
    fontSize: 14,
    marginBottom: hp(1),
    fontFamily: Fonts.IBM_SemiBold,
  },
  offerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    paddingHorizontal: wp(3),
  },
  priceText: {
    color: colors.lightTheme,
    fontFamily: Fonts.IBM_Regular,
  },
  userSection: {
    marginTop: hp(1),
    paddingBottom: hp(1.5),
    marginHorizontal: wp(3),
  },
  myOffer: {
    marginTop: hp(1.5),
    marginBottom: hp(5),
  },
  title: {
    fontSize: 16,
    // color: colors.heading,
    marginBottom: hp(1.5),
    paddingHorizontal: wp(3),
    fontFamily: Fonts.IBM_SemiBold,
  },
  commentBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: wp(3),
  },
  commentText: {
    fontWeight: '600',
    textDecorationLine: "underline",
  },
  labelStyle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    textTransform: "none",
    fontFamily: Fonts.IBM_Regular,
  },
  button: {
    marginTop: hp(2),
    marginBottom: hp(1.5),
  },
  button1: {
    width: wp(30),
    marginTop: 0,
  },

  //Notify Hunter Modal Styles
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  modalView: {
    width: wp(90),
    borderRadius: 7,
    backgroundColor: "#fff",
  },
  headerSection: {
    backgroundColor: "#000",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  joinModalText: {
    fontSize: 16,
    color: colors.cWhite,
    fontFamily: Fonts.IBM_Medium,
  },
  msgSection: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: hp(1),
  },
  msgText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightText,
  },
  input: {
    padding: wp(2),
    borderWidth: 1,
    height: hp(5),
    marginTop: hp(1),
    borderRadius: 7,
    color: colors.lightBlack,
    fontFamily: Fonts.IBM_Regular,
    borderColor: colors.borderColor,
    backgroundColor: colors.background,
  },
  modalBtn: {
    marginTop: hp(2.5),
    marginBottom: hp(1),
  },
  exhibJoinSection: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: hp(1.5),
  },
  modalBtnSection: {
    flexDirection: "row",
    marginTop: hp(0.5),
  },
  visitorBtn: {
    width: "50%",
    height: hp(5),
    borderRadius: 2,
    borderWidth: 1.2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.lightTheme,
  },
  mediaSection: {
    paddingTop: hp(1),
  },
  addStampCard: {
    width: hp(9),
    height: hp(9),
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.cBlack,
    backgroundColor: colors.cWhite,
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
    borderColor: colors.lightTheme,
    backgroundColor: colors.cWhite,
  },
  selectedMedia: {
    width: hp(5),
    height: hp(9),
    marginVertical: hp(0.3),
    alignSelf: "center",
  },
  crossIcon: {
    position: "absolute",
    alignSelf: "flex-end",
    color: colors.cBlack,
  },
});
