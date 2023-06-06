import { StyleSheet } from "react-native";

import colors from "../../../../../constant/colors";
import Fonts from "../../../../../assets/fonts/Fonts";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  btnSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
    marginTop: hp(2),
    paddingBottom: hp(1.5),
  },
  addButton: {
    position: "absolute",
    backgroundColor: colors.color8,
    bottom: 40,
    right: wp(6),
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
  },
  headingText: {
    fontSize: 16,
    marginTop: hp(1),
    fontWeight: "500",
    // color: colors.lightBlack,
    paddingHorizontal: wp(3),
  },
  subHeading: {
    fontSize: 12,
    marginTop: hp(1),
    fontWeight: "500",
    // color: colors.lightText,
    paddingHorizontal: wp(3),
  },
  listComp: {
    width: 75,
    height: 75,
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: colors.background,
  },
  categImg: {
    width: 55,
    height: 55,
    alignSelf: "center",
    borderRadius: hp(10),
  },
  nameText: {
    marginTop: 2,
    fontSize: 12,
    textAlign: "center",
    color: colors.lightText,
  },
  emptyImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignSelf: "center",
  },
  emptyItem: {
    width: 50,
    height: 15,
    marginTop: 5,
    borderRadius: 4,
    alignSelf: "center",
  },
  emptyList: {
    paddingTop: hp(0.5),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 12,
    color: colors.theme,
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listStyle: {
    alignSelf: "center",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
  },
  guideIcon: {
    position: "absolute",
    top: hp(6),
    right: wp(3),
  },
});
