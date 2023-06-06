import React, { useContext } from "react";
import { Pressable, StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AppText from "./AppText";
import ThemeContext from "../src/Context/ThemeContext";

const DrawerCollapsible = (props) => {
  const { title, onPress, toggle = false } = props;
  const { theme } = useContext(ThemeContext);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.toggler, { backgroundColor: theme?.cardColorLight }]}
    >
      <AppText style={[styles.text, { color: theme?.black }]}>{title}</AppText>
      <MaterialIcons
        name={toggle ? "keyboard-arrow-up" : "keyboard-arrow-down"}
        color={theme?.black}
        size={hp(2.5)}
      />
    </Pressable>
  );
};

export default DrawerCollapsible;

const styles = StyleSheet.create({
  toggler: {
    height: hp(4.5),
    marginTop: hp(1),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
});
