import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../constant/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  avatar: {
    width: hp(13.5),
    height: hp(13.5),
    borderRadius: hp(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cWhite,
    borderColor: colors.borderColor,
    borderWidth: 1,
  },
  userImage: {
    width: hp(13),
    height: hp(13),
    borderRadius: hp(100),
    resizeMode: "cover",
  },
  storeInfo: {
    width: "100%",
    height: hp(6.5),
    // backgroundColor: "orange",
  },
  userSection: {
    alignSelf: "center",
  },
  idText: {
    fontSize: 12,
    marginTop: 3,
  },
  titleText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: Fonts.IBM_Bold,
    marginTop: hp(0.5),
  },
  infoSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: wp(8),
  },
  idSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  uidText: {
    fontWeight: "bold",
  },
  rText: {
    marginRight: wp(1),
  },
  guideIcon: {
    position: "absolute",
    top: hp(7),
    right: wp(5),
  },
  labelStyle: {
    fontSize: 14,
    textAlign: "center",
    textTransform: "none",
    fontFamily: "Roboto-Regular",
  },
});
