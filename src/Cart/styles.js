import { StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../constant/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainSection: {
    flex: 0.8,
  },
  topCard: {
    height: 60,
    width: "90%",
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 10,
    borderRadius: 2,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  emptyListText: {
    color: colors.lightText,
    alignSelf: "center",
    marginTop: 280,
  },
  bottomSection: {
    flex: 0.2,
    // height: 50,
    // backgroundColor: 'grey',
    borderTopWidth: 1,
    borderColor: "lightgrey",
    paddingHorizontal: wp(5),
  },
  amountSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  itemText: {
    color: colors.lightText,
  },
  btnStyle: {
    alignSelf: "center",
    marginTop: 20,
  },
  list: {
    paddingHorizontal: wp(3),
  },
  card: {},
});
