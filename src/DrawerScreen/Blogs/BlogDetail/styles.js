import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../constant/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgrondColor: "#ffff",
  },
  image: {
    width: wp(100),
    height: hp(35),
    // resizeMode: "cover",
  },
  heading: {
    fontSize: 16,
    // color: colors.heading,
    fontWeight: "500",
  },
  text: {
    color: colors.lightText,
    marginTop: 20,
  },
  iconText: {
    fontSize: 14,
    fontWeight: "400",
  },
  description: {
    // paddingHorizontal: wp(3),
    marginTop: hp(1.5),
    color: colors.btnText,
    fontFamily: Fonts.Inter_Regular,
  },
  commentSection: {
    backgroundColor: "#DCDCDC",
    padding: 10,
    marginTop: 25,
    alignSelf: "flex-end",
    width: wp(100),
  },
  cText: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 20,
  },
  commentButton: {
    width: wp(96),
    minHeight: 50,
    maxHeight: "50%",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 25,
    padding: 10,
    backgroundColor: "#DCDCDC",
    justifyContent: "space-between",
  },
  commentIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.theme,
    borderRadius: 25,
  },
  CCard: {
    width: wp(100),
    flexDirection: "row",
    // alignItems: "center",
    marginBottom: 7,
  },
  CCImage: {
    height: 50,
    width: 50,
    marginTop: 5,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  commentCounter: {
    fontSize: 14,
    color: colors.comment,
  },
  commentsSection: {
    paddingBottom: 10,
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentIcon: {
    width: 16,
    height: 16,
    tintColor: colors.lightTheme,
  },
  publicText: {
    marginLeft: 5,
    fontSize: 14,
    color: colors.lightText,
    fontWeight: "500",
    top: 2,
  },
});
