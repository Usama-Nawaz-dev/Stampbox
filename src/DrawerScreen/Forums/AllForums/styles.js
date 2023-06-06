import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../constant/colors";
import Fonts from "../../../../assets/fonts/Fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgrondColor: "#ffff",
  },
  headingText: {
    fontSize: 18,
    marginTop: hp(1),
    fontWeight: "500",
    paddingHorizontal: wp(3),
  },

  //Question Card Text
  qCard: {
    padding: wp(3),
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
  },
  qInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp(0.5),
    paddingHorizontal: wp(3),
  },
  viewText: {
    fontSize: 10,
  },
  borderView: {
    marginRight: wp(1),
    paddingRight: wp(1),
    borderRightWidth: 1,
    borderColor: colors.borderColor,
  },
  qText: {
    fontWeight: "500",
    paddingBottom: hp(0.5),
  },
  ansText: {
    fontSize: 12,
    paddingBottom: hp(1.5),
    color: colors.lightText,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
