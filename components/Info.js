import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../constant/colors";
import AppText from "./AppText";

const Info = ({ key1, val1, key2, val2, width, textStyle, infoStyle, style }) => {
  return (
    <View style={[styles.infoSection, { width: width ? width : "100%" }, style]}>
      <AppText style={[styles.text, textStyle]}>
        {key1}:
        <AppText style={[styles.infoText, infoStyle]}>{` ${val1 ? val1 : "N/A"
          }`}</AppText>
      </AppText>
      {key2 && (
        <AppText style={[styles.text, textStyle]}>
          {key2}:
          <AppText style={[styles.infoText, infoStyle]}>{` ${val2}`}</AppText>
        </AppText>
      )}
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  infoSection: {
    flexDirection: "row",
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // left: 10,
    marginBottom: hp(0.5),
  },
  text: {
    fontSize: 14,
    // color: colors.lightBlack,
  },
  infoText: {
    fontWeight: "400",
    // color: colors.lightText,
  },
});
