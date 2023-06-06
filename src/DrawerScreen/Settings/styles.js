import { StyleSheet, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  section: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  CardView: {
    width: wp(95),
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingVertical: 20,
    alignSelf: "center",
  },
  iconView: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: colors.darkTheme,
  },
  cardText: {
    fontSize: 16,
    // fontWeight: '500',
    marginLeft: 15,
  },
  signOutView: {
    width: wp(95),
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingVertical: 20,
    alignSelf: "center",
  },
});
