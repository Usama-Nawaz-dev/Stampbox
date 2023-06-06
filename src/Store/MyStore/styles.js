import { StyleSheet, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../constant/colors";
import { light as theme } from "../../../constant/colorsConfig";

const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  labelStyle: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    paddingHorizontal: 5,
    textTransform: "none",
  },
  header: {
    // height: 200,
    flexDirection: "row",
    // alignItems: 'center',
    paddingHorizontal: wp(3),
    marginVertical: 15,
    marginBottom: 15,
    marginTop: hp(16),
  },
  sheet: {
    height: 30,
    width: 30,
    borderRadius: 10,
    backgroundColor: theme.theme,
    alignItems: "center",
    justifyContent: "center",
    bottom: 5,
    right: -5,
    position: "absolute",
    zIndex: 1000,
  },
  userImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    resizeMode: "cover",
  },
  editBtn: {
    width: 30,
    height: 30,
    backgroundColor: colors.lightTheme,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hp(10),
    position: "absolute",
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  userSection: {
    alignSelf: "center",
    // marginTop: -40,
    // backgroundColor: 'red',
    // marginTop: hp(10),
    // position: 'absolute',
    // zIndex: 1000,
  },
  storeImg: {
    height: 85,
    width: 85,
    marginLeft: wp(3),
  },
  detailsSection: {
    marginLeft: 20,
    marginTop: 7,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
  },
  idText: {
    fontSize: 12,
    marginTop: 3,
  },
  ratingText: {
    fontSize: 12,
  },
  ratingSection: {
    flexDirection: "row",
    marginTop: 3,
  },
  star: {
    width: 13,
    height: 13,
    marginLeft: 5,
    borderRadius: 30,
    tintColor: "orange",
  },
  editIcon: {
    width: 36,
    height: 36,
    borderRadius: 100,
    backgroundColor: theme.theme,
    justifyContent: "center",
    alignItems: "center",
    left: 80,
    top: 70,
    // position: 'absolute',
    // zIndex: 1000
  },
  avatar: {
    width: 115,
    height: 115,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.stayWhite,
  },
  // Scrollable Top Tabs Style
  tabsSection: {
    flex: 1,
    bottom: 40,
    // marginTop: hp(20)
  },
  shadowSection: {
    backgroundColor: "#fff",
    shadowColor: "000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    marginBottom: 5,
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightText,
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
});
