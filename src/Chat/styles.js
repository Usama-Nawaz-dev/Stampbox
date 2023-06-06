import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../constant/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.theme,
    fontWeight: "500",
  },
  addButton: {
    position: "absolute",
    backgroundColor: colors.color8,
    bottom: 20,
    right: wp(6),
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  labelStyle: {
    fontSize: 14,
    textAlign: "center",
    textTransform: "none",
    fontFamily: "Roboto-Regular",
  },
  planSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    // backgroundColor: 'pink'
  },
  userIcon: {
    width: 15,
    height: 15,
    tintColor: "orange",
    borderRadius: 30,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: 'orange',
    marginHorizontal: 10,
  },
  unreadCounter: {
    height: 20,
    width: 20,
    borderRadius: 13,
    backgroundColor: colors.lightTheme,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  //   userImg: {
  //     width: 50,
  //     height: 50,
  //     borderRadius: 30,
  //   },
  //   nameText: {
  //     maxWidth: wp(40),
  //     color: colors.heading,

  //   },
  //Request Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: wp(80),
  },
  modalView: {
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
    height: 55,
    width: 55,
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
  },
});
