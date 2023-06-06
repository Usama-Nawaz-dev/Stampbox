import { StyleSheet } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
    paddingTop: 15,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
  },
  upperSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImg: {
    width: 36,
    height: 36,
    borderRadius: hp(10),
  },
  nameSection: {
    marginLeft: wp(3),
  },
  timeSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 16,
    fontFamily: Fonts.IBM_Medium,
    color: colors.lightBlack,
  },
  agoText: {
    fontSize: 12,
    color: colors.lightText,
    fontFamily: Fonts.Inter_Medium,
  },
  earthIcon: {
    width: 12,
    height: 12,
  },
  timeText: {
    fontSize: 8,
    color: "grey",
    // marginRight: hp(0.3)
  },
  descriptionText: {
    marginVertical: 10,
    fontSize: 12,
    paddingHorizontal: wp(3),
    fontFamily: Fonts.Inter_Regular,
    color: colors.lightText,
  },
  postImage: {
    width: wp(100),
    height: hp(25),
    marginTop: hp(0.5),
    resizeMode: "contain",
  },
  dateText: {
    fontSize: 10,
    color: colors.theme,
    marginTop: hp(0.5),
    marginLeft: wp(2),
  },
  stampInfoText: {
    marginTop: hp(0.5),
    marginLeft: wp(2),
    fontSize: 16,
  },
  button: {
    marginTop: hp(1),
    marginLeft: wp(1.5),
  },
  bottomSection: {
    // backgroundColor: "#F6F6F6",
    paddingHorizontal: wp(3),
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  countSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  horizontalLine: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginVertical: 10,
    borderColor: colors.borderColor,
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCounter: {
    marginHorizontal: hp(0.3),
    fontSize: 10,
  },
  commentCounter: {
    fontSize: 14,
    color: colors.comment,
  },
  commentsSection: {
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentIcon: {
    width: 16,
    height: 16,
  },
  publicText: {
    marginLeft: 5,
    fontSize: 14,
    color: colors.lightText,
    fontWeight: "500",
    top: 2,
  },
});
