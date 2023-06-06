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
    backgroundColor: "#fff",
  },
  upperSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 7,
    paddingHorizontal: wp(3),
  },
  leftText: {
    fontSize: 16,
    fontWeight: "500",
    maxWidth: wp(85),
    // color: colors.heading
  },
  infoCard: {
    borderRadius: 5,
    shadowRadius: 0.5,
    shadowOpacity: 0.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    backgroundColor: colors.cWhite,
    paddingHorizontal: wp(1),
    marginHorizontal: wp(2),
    paddingBottom: hp(1),
  },
  text: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: "500",
    // color: colors.heading,
  },
  infoText: {
    fontWeight: "400",
    // color: colors.lightText
  },
  sortBy: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: wp(3),
  },
  sortByText: {
    fontSize: 12,
    fontWeight: "500",
    marginRight: wp(1),
    // color: colors.lightText,
  },
  albumImg: {
    width: "100%",
    height: hp(25),
  },

  // Scrollable Top Tabs Style
  tabsSection: {
    flex: 1,
  },
  headerScroll: {
    flexGrow: 0,
  },
  headerItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
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
    // borderWidth: 5,
    // borderColor: '#fff',
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightText,
  },

  guideIcon: {
    position: "absolute",
    top: hp(6),
    right: wp(3),
  },
});
