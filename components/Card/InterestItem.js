import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../AppText";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ThemeContext from "../../src/Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

export const InterestItem = (props) => {
  const { item, maxWidth } = props;
  const { theme }= useContext(ThemeContext);
  return (
    <View
      style={[styles.container, { maxWidth: maxWidth ? maxWidth : wp(30) }]}
    >
      <AppText numberOfLines={1} style={[styles.text, { color: theme?.theme}]}>
        {item}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 30,
    maxWidth: wp(30),
    backgroundColor: "rgba(191, 114, 89, 0.2)",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(2),
  },
  text: {
    color: "#BF7259",
    fontSize: 12,
    fontWeight: "500",
  },
});
