import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: dark
  },
  editBtn: {
    width: 30,
    height: 30,
    // backgroundColor: colors.lightTheme,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hp(10),
    position: "absolute",
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  userSection: {
    alignSelf: "center",
    marginTop: -40,
  },
  userImage: {
    width: 110,
    height: 110,
    borderRadius: hp(10),
    resizeMode: "cover",
  },
  followSection: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around",
    width: wp(85),
  },
  verticleLine: {
    height: "60%",
    width: 1,
    backgroundColor: colors.borderColor,
    alignSelf: "center",
  },
  countSection: {
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 18,
    // color: colors.heading,
    fontFamily: Fonts.IBM_SemiBold,
  },
  followText: {
    fontSize: 14,
    marginTop: 5,
    // color: colors.heading,
    fontFamily: Fonts.IBM_Regular,
  },
  planSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3.5),
    marginTop: 20,
  },
  userDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: wp(6),
  },
  userText: {
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 5,
    // color: colors.heading,
    fontFamily: Fonts.IBM_SemiBold,
  },
  userInfo: {
    // color: colors.heading,
    fontFamily: Fonts.IBM_Regular,
  },
  valueText: {
    // color: colors.heading,
    fontFamily: Fonts.IBM_Medium,
  },
  gradBtnSection: {
    flexDirection: "row",
    // paddingHorizontal: wp(3),
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.IBM_Medium,
    color: colors.heading,
  },
  otherSection: {
    paddingBottom: 15,
    paddingHorizontal: wp(3),
  },
  tabSection: {
    marginTop: hp(1),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedTab: {
    width: wp(30),
    borderRadius: 5,
    alignItems: "center",
    paddingVertical: hp(1.2),
    backgroundColor: colors.lightTheme,
  },
  defaultTab: {
    width: wp(30),
    borderRadius: 5,
    alignItems: "center",
    paddingVertical: hp(1.2),
    backgroundColor: colors.background,
  },
  tabText: {
    fontSize: 12,
    color: colors.btnText,
  },
  emptySection: {
    height: hp(12),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
  lockIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: "contain",
    tintColor: colors.cWhite,
  },
  followBtn: {
    marginTop: hp(2),
    alignSelf: "center",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  flBtn: {
    fontSize: 12,
    marginRight: 5,
    fontWeight: "500",
    color: colors.blueTheme,
    fontFamily: Fonts.Inter_Regular,
  },

  //Image Picker Modal
  centeredView: {
    width: wp(50),
    marginTop: hp(40),
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
  idSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  //Follow Modal Styles
  requestModal: {
    flex: 1,
    width: wp(80),
    alignSelf: "center",
    justifyContent: "center",
  },
  reqModalView: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
  },
  button: {
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.borderColor,
  },
  btnText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
    paddingVertical: hp(1),
  },
  userImg: {
    height: 80,
    width: 80,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: colors.borderColor,
  },
  infoText: {
    fontSize: 11,
    maxWidth: wp(65),
    textAlign: "center",
    color: colors.heading,
    marginTop: hp(2),
    marginBottom: hp(1.5),
    paddingHorizontal: wp(2),
  },
  nameText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.heading,
  },
});
