import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../constant/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  listStyle: {
    paddingTop: hp(0.5),
    paddingBottom: hp(1),
    paddingHorizontal: wp(3),
  },
  loader: {
    flex: 1,
    marginRight: wp(5),
    justifyContent: "center",
  },
  itemView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: hp(0.5),
    paddingHorizontal: wp(3),
  },
});
