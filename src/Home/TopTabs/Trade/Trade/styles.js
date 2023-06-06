import { StyleSheet, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../../constant/colors";

const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: hp(100),
    // backgroundColor: "red",
  },
  headerScroll: {
    flexGrow: 0,
  },
  headerItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
  },
  headerBar: {
    height: 1.8,
    width: "100%",
    alignSelf: "center",
    backgroundColor: colors.theme,
    position: "absolute",
    bottom: 0,
  },
  mainItem: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightText,
  },

  labelStyle: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    paddingHorizontal: 5,
    textTransform: "none",
  },

  guideIcon: {
    position: "absolute",
    top: hp(5),
    right: wp(5),
  },
});
