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
    backgrondColor: colors.red,
  },
  labelStyle: {
    fontSize: 14,
    textAlign: "center",
    textTransform: "none",
    fontFamily: Fonts.IBM_Medium,
  },
});
