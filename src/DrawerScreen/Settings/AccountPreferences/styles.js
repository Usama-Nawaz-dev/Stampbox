import { StyleSheet, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../constant/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
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
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 15,
  },
  checkBox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 2,
    marginRight: 5,
    borderColor: colors.lightBlack,
    alignItems: "center",
    justifyContent: "center",
  },
});
