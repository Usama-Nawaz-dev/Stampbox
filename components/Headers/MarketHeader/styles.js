import { StyleSheet } from "react-native";

import colors from "../../../constant/colors";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  container: {
    height: 70,
    width: wp(100),
    backgroundColor: colors.cWhite,
  },
  bgImage: {
    // width: wp(100),
    height: 100,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: 'center',
    marginTop: 10,
  },
  titleSection: {
    flexDirection: "row",
    // alignItems: "center",
    marginLeft: 15,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "IBMPlexSans-Regular",
    color: colors.cWhite,
    marginLeft: 10,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 15,
  },
  counterSection: {
    height: 18,
    width: 18,
    borderRadius: 10,
    backgroundColor: colors.theme,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -7,
    right: -7,
    zIndex: 999,
  },
  counterText: {
    fontSize: 9,
    color: colors.cWhite,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  locationText: {
    marginHorizontal: 3,
    color: colors.disable,
  },
  searchContainer: {
    width: wp(100),
    position: "absolute",
    bottom: -20,
    flexDirection: "row",
    paddingHorizontal: wp(5),
    alignItems: "center",
    justifyContent: "space-between",
    opacity: 0.95,
    // backgroundColor: 'red'
  },
  searchSection: {
    width: wp(75),
    backgroundColor: colors.cWhite,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.borderColor,
  },
  filterSection: {
    width: wp(12),
    height: "100%",
    backgroundColor: colors.cWhite,
    alignItems: "center",
    justifyContent: "center",
    // paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.borderColor,
  },
  input: {
    fontFamily: "Inter-Regular",
    marginLeft: 10,
  },
});
