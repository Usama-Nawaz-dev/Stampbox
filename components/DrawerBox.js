import React, { useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "./AppText";
import ThemeContext from "../src/Context/ThemeContext";

const DrawerBox = (props) => {
  const { title, onPress, style } = props;
  const { theme } = useContext(ThemeContext);
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <AppText style={[styles.text, { color: theme?.black }, style]}>
          {title}
        </AppText>
      </View>
    </Pressable>
  );
};

export default DrawerBox;

const styles = StyleSheet.create({
  container: {
    marginTop: hp(1),
    flexDirection: "row",
  },
  text: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginHorizontal: wp(3),
  },
});
