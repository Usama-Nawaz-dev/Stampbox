import { StyleSheet, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "../../assets/fonts/Fonts";
import colors from "../../constant/colors";

const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topTabs: {
    // flex: 0.17,
    // height: hp(13.8),
    borderTopWidth: 0.5,
    borderColor: "grey",
    backgroundColor: "#dbd6ca",
    paddingHorizontal: wp(3),
    paddingTop: hp(0.5),
    flexDirection: "row",
    // justifyContent: 'space-between'
  },
  pickerHeader: {
    height: 30,
    width: "100%",
    backgroundColor: "lightgrey",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  picker: {
    height: 230,
    width: "100%",
    position: "absolute",
    bottom: 20,
    //   right: 0,
    //   backgroundColor: "red",
  },
  searchSection: {
    height: hp(5),
    width: wp(80),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: wp(3),
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: hp(0.5),
    backgroundColor: colors.cWhite,
    borderColor: colors.borderColor,
  },
  mainFilters: {
    width: "95%",
    alignSelf: "center",
    //   backgroundColor: "grey",
    marginBottom: -5,
  },
  searchBtn: {
    height: 40,
    width: "60%",
    alignSelf: "center",
    marginBottom: 25,
  },
  inputText: {
    fontSize: 14,
    marginBottom: 10,
    color: colors.btnText,
    fontFamily: Fonts.Roboto_Regular,
  },
  topicContainer: { width: "90%", marginTop: hp(2), alignSelf: "center" },
  biView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 18,
    marginBottom: 5,
    marginTop: 10,
  },
  advContainer: { flex: 1, backgroundColor: "#fff" },
  radioItems: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
    margin: 10,
    height: 25,
    //   backgroundColor: "grey",
  },
  topicChips: {
    height: 30,
    //   width: 100,
    maxWidth: 100,
    backgroundColor: "rgba(191, 114, 89, 0.2)",
    borderWidth: 1.5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  uncheck: {
    height: 18,
    width: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: "grey",
  },
  searchContainer: {
    opacity: 0.95,
    width: wp(100),
    marginTop: -hp(3),
    flexDirection: "row",
    paddingHorizontal: wp(3),
    // marginBottom: hp(1),
  },
  input: {
    fontFamily: Fonts.IBM_Regular,
    marginLeft: wp(3),
    width: wp(70),
    height: "100%",
    fontSize: 12,
  },
  tabSection: {
    flex: 0.35,
    borderLeftWidth: 0.5,
    borderColor: "grey",
  },
  addPostSection: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    paddingBottom: hp(1),
  },
  postImg: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(10),
    resizeMode: "cover",
    backgroundColor: "red",
  },
  postAdd: {
    width: "75%",
    height: hp(5),
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: wp(3),
    borderColor: colors.borderColor,
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
  },
  addPostText: {
    fontSize: 12,
    // color: colors.placeholderText
  },
  // container: {
  //   justifyContent: "center",
  //   flex: 1,
  // },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: "#800000",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  back: {
    flex: 1,
    backgroundColor: "#f1c40f",
    justifyContent: "center",
    alignItems: "center",
  },

  //Guid Icons
  guide1: {
    position: "absolute",
    top: hp(5),
    left: wp(4),
  },
  guide2: {
    position: "absolute",
    top: hp(5),
    right: wp(15),
  },
  guide3: {
    position: "absolute",
    top: hp(5),
    right: wp(3),
  },
  guide4: {
    position: "absolute",
    bottom: hp(2.5),
    right: wp(5),
  },
});
