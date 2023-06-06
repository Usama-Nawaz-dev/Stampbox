import { StyleSheet, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  listStyle: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(3),
  },
  loader: {
    marginBottom: hp(1.5),
  },
  itemView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
