import { StyleSheet, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../constant/colors";

const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: "#fff",
    paddingTop: 5,
  },
  switchSection: {
    flexDirection: "row",
    marginTop: hp(1),
    paddingHorizontal: wp(3),
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedTab: {
    backgroundColor: colors.background,
    paddingVertical: wp(2.5),
    paddingHorizontal: wp(12),
    borderRadius: 5,
  },
  defaultTab: {
    backgroundColor: "transparent",
    paddingVertical: wp(2),
    paddingHorizontal: wp(10),
    borderRadius: 7,
  },
  tabText: {
    fontSize: 14,
    color: colors.btnText,
  },

  //Header Tabs

  tabSection: {
    // flex: 1,
    marginTop: 10,
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    // color: colors.lightText,
  },
  cardSection: {
    width: width,
    backgroundColor: "#fff",
    // paddingTop: 20,
    paddingHorizontal: wp(3),
    marginBottom: 100,
  },
  addBtn: {
    position: "absolute",
    top: hp(6.5),
    right: wp(3),
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 3,
    zIndex: 999,
  },
});
