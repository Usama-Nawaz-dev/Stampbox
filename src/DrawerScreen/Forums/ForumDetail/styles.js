import { StyleSheet } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import colors from "../../../../constant/colors";
import Fonts from "../../../../assets/fonts/Fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  qCard: {
    width: wp(94),
    marginHorizontal: wp(3),
    backgroundColor: "#fff",
    borderRadius: 7,
    marginTop: hp(1),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    padding: wp(2),
    marginBottom: hp(3)
  },
  qInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp(0.5),
  },
  viewText: {
    fontSize: 14,
    fontWeight: "500",
  },
  borderView: {
    marginRight: wp(1),
    paddingRight: wp(1),
    borderLeftWidth: 1,
    borderColor: colors.lightTheme,
    paddingLeft: wp(2),
    width: wp(45),
  },
  qText: {
    fontWeight: "600",
    paddingBottom: hp(0.5),
  },
  hText: {
    fontSize: 14,
    marginTop: hp(1),
    fontWeight: "500",
    paddingHorizontal: wp(3),
  },
  dText: {
    marginTop: hp(2),
    marginBottom: hp(1),
    paddingHorizontal: wp(3),
    color: colors.lightBlack,
  },
  button: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: wp(3),
    alignSelf: "flex-start",
  },
  replyText: {
    fontWeight: "600",
    marginVertical: hp(1),
    paddingHorizontal: wp(3),
  },

  //Comment Card
  CCard: {
    width: wp(100),
    marginTop: hp(1.5),
    marginBottom: hp(1),
    flexDirection: "row",
    paddingHorizontal: wp(2),
  },
  CCImage: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(100),
    backgroundColor: "#fff",
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.heading,
  },
  commentText: {
    fontSize: 12,
    maxWidth: wp(80),
    marginTop: hp(0.3),
    color: colors.lightText,
  },
  infoSection: {
    marginLeft: wp(3),
  },
});
