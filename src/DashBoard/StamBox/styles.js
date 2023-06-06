import { StyleSheet, NativeModules } from "react-native";

const { StatusBarManager } = NativeModules;

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../constant/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  switchSection: {
    flexDirection: "row",
    marginTop: hp(2),
    paddingHorizontal: wp(5),
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 12,
    marginTop: hp(2),
    paddingHorizontal: wp(5),
    color: "rgba(0,0,0,0.6)",
  },
  itemText1: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
  },
  filterSection: {
    width: wp(26),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filter: {
    width: hp(3.8),
    height: hp(3.8),
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  emptyList: {
    height: "60%",
    // backgroundColor: 'red',
    justifyContent: "center",
    alignItems: "center",
  },
  gifStyle: {
    width: 200,
    height: 200,
  },
  emptyText: {
    fontSize: 18,
    marginTop: -15,
    // color: colors.lightText
  },
  record: {
    fontSize: 12,
    color: colors.lightText,
    marginTop: 5,
  },
  retryButton: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
  },
  labelStyle: {
    fontSize: 14,
    textAlign: "center",
    textTransform: "none",
    fontFamily: "Roboto-Regular",
  },
  addBtn: {
    zIndex: 999,
    width: hp(5.5),
    height: hp(5.5),
    right: wp(3),
    bottom: hp(4),
    position: "absolute",
    borderRadius: hp(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.color8,
  },

  //Filter Modal Styles
  centeredView: {
    flex: 1,
    marginTop: StatusBarManager.HEIGHT,
  },
  modalView: {
    backgroundColor: "rgba(219, 214, 202, .95)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
  },
  textStyle: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: hp(1.5),
  },
  modalText1: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: hp(1),
  },
  btnSection: {
    width: wp(90),
    marginTop: hp(2),
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-around",
  },
  applyBtn: {
    borderRadius: 5,
    padding: hp(1.2),
    paddingHorizontal: wp(8),
    backgroundColor: colors.lightTheme,
  },
  closeBtn: {
    borderRadius: 5,
    padding: hp(1.2),
    paddingHorizontal: wp(8),
    backgroundColor: colors.background,
  },
  cancelText: {
    fontSize: 12,
    textAlign: "center",
    color: colors.btnText,
  },
});
