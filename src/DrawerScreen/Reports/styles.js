import { StyleSheet } from "react-native";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  card: {
    width: wp(35),
    height: wp(32),
    padding: wp(1),
    borderRadius: 10,
    marginRight: wp(2),
    shadowRadius: 1.84,
    shadowOpacity: 0.25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: colors.cWhite,
    justifyContent: "center",
  },
  listStyle: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
  },
  countText: {
    fontSize: 20,
    alignSelf: "center",
    color: colors.lightTheme,
    fontFamily: Fonts.IBM_Medium,
  },
  infoText: {
    fontSize: 14,
    marginTop: hp(1),
    alignSelf: "center",
    textAlign: "center",
    // color: colors.heading,
  },
  cardSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(2),
    marginTop: hp(1.5),
  },
  mulCard: {
    width: "49%",
    height: hp(28),
    borderRadius: 10,
    shadowRadius: 1.84,
    shadowOpacity: 0.25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: colors.cWhite,
  },
  collectionCard: {
    width: "96%",
    height: hp(25),
    borderRadius: 10,
    shadowRadius: 1.84,
    shadowOpacity: 0.25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: colors.cWhite,
    alignSelf: "center",
    marginBottom: hp(1),
  },
  cardHeader: {
    padding: wp(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.background,
  },
  headerText: {
    color: colors.heading,
    fontFamily: Fonts.IBM_SemiBold,
  },
  subHeader: {
    marginTop: hp(0.5),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  constionComp: {
    marginTop: hp(0.5),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(2),
  },
  subHeaderRight: {
    width: wp(50),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  itemText: {
    fontSize: 12,
  },
  valueText: {
    fontSize: 12,
    fontWeight: "600",
    maxWidth: wp(43),
    // color: colors.heading
  },
  valueText1: {
    fontSize: 12,
    fontWeight: "500",
    maxWidth: wp(38),
    // color: colors.heading
  },
  constionComp: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    marginHorizontal: wp(1.5),
    paddingHorizontal: wp(1),
    paddingVertical: hp(0.7),
    marginTop: wp(1.5),
    borderRadius: 5,
  },
});
