import { StyleSheet, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "../../../../../assets/fonts/Fonts";
import colors from "../../../../../constant/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    height: hp(22),
    width: "100%",
    backgroundColor: colors.lightTheme,
    marginTop: hp(1),
    justifyContent: "space-evenly",
  },
  heading: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontFamily: Fonts.IBM_Bold,
  },
  txtBody: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: wp(2),
    fontFamily: Fonts.Roboto_Regular,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  reply: {
    height: 25,
    width: 60,
    backgroundColor: colors.lightTheme,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  ask: {
    color: colors.lightTheme,
    fontSize: 12,
    fontWeight: "500",
    marginRight: 20,
  },
  rgbBtn: {
    height: 28,
    width: 80,
    borderRadius: 5,
    backgroundColor: "rgba(178,84,58,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  txtColor: { color: "grey", fontSize: 12 },
  summary: { flex: 0.5, justifyContent: "space-evenly", padding: 8 },
  summaryContainer: {
    height: hp(18),
    width: wp(95),
    backgroundColor: colors.color2,
    alignSelf: "center",
    borderRadius: 10,
    flexDirection: "row",
  },

  //Comment Card
  CCard: {
    width: wp(100),
    flexDirection: "row",
    // marginBottom: hp(1),
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    paddingHorizontal: wp(2),
    borderColor: colors.borderColor,
  },
  CCImage: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(100),
    backgroundColor: "#fff",
  },
  commentUser: {
    fontSize: 12,
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

  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
  },
  input: {
    width: "90%",
    fontSize: 14,
    height: hp(5),
    padding: wp(3),
    borderRadius: 5,
    marginRight: wp(2),
    paddingTop: hp(1.5),
    backgroundColor: colors.background,
  },
});
