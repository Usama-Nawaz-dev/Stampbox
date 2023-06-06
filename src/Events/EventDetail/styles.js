import { StyleSheet } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  infoSection: {
    paddingTop: hp(1),
    paddingHorizontal: wp(3),
  },
  title: {
    fontSize: 18,
    maxWidth: wp(65),
    // color: colors.heading,
    fontFamily: Fonts.IBM_SemiBold,
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.5),
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: wp(2),
  },
  dateText: {
    fontSize: 12,
    maxWidth: wp(65),
    marginLeft: wp(1),
    textAlign: "center",
    // color: colors.lightText,
  },
  locSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(0.5),
  },
  mapText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.color8,
  },
  timeText: {
    marginTop: hp(0.5),
    // color: colors.heading,
    fontFamily: Fonts.IBM_Regular,
  },
  joinText: {
    fontSize: 16,
    fontWeight: "500",
    // color: colors.heading,
    fontFamily: Fonts.IBM_Medium,
  },
  headingText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: hp(0.5),
    // color: colors.heading,
    fontFamily: Fonts.IBM_Medium,
  },
  instructionText: {
    fontSize: 12,
    marginTop: hp(0.3),
    color: colors.lightText,
  },
  detailSection: {
    marginTop: hp(1.5),
    borderTopWidth: 1,
    borderColor: colors.borderColor,
    paddingTop: hp(1.5),
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  userCard: {
    flexDirection: "row",
    height: hp(5.5),
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
    backgroundColor: colors.cWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 5,
    marginTop: hp(2),
  },
  userIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: "contain",
  },
  heading: {
    fontSize: 14,
    marginLeft: wp(3),
    // color: colors.heading,
    fontFamily: Fonts.IBM_Medium,
  },
  heading1: {
    fontSize: 14,
    marginLeft: wp(3),
    color: colors.lightTheme,
    fontFamily: Fonts.IBM_SemiBold,
  },
  participantImg: {
    width: hp(2.8),
    height: hp(2.8),
    borderRadius: hp(10),
  },
  arrow: {
    marginTop: hp(0.3),
    color: colors.btnText,
  },
  btnSection: {
    width: wp(70),
    marginTop: hp(1),
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    width: wp(28),
    marginTop: 0,
  },
  button1: {
    width: wp(25),
    marginTop: 0,
  },
  requestSection: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  submitBtn: {
    width: wp(25),
    marginTop: hp(1.5),
  },
  participantSection: {
    marginTop: hp(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  awardSection: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  awardText: {
    fontSize: 13,
    fontWeight: "500",
    marginLeft: wp(1.5),
    color: colors.btnText,
  },
  coinIcon: {
    width: hp(2),
    height: hp(2),
    tintColor: colors.btnText,
  },

  //Join Modal Styles
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
  infoSection: {
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
    height: hp(5),
    borderWidth: 1,
    padding: wp(2),
    borderRadius: 7,
    marginTop: hp(1),
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
