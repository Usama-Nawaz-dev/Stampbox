import React, { useContext } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import colors from "../constant/colors";
import defaultStyles from "../constant/styles";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AppText from "./AppText";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ThemeContext from "../src/Context/ThemeContext";

export default function AppTextInput({
  icon,
  name,
  inputLabel,
  width = "100%",
  passwordToggle,
  ...otherProps
}) {
  const {theme, mode} = useContext(ThemeContext);
  // console.log('otherProps', otherProps);
  return (
    <View style={[styles.container, { width }]}>
      {/* <AppText style={styles.text}>{inputLabel}</AppText> */}
      <View
        style={[
          styles.inputContainer,
          {
            height: inputLabel === "Description" ? 90 : 50,
            borderRadius: inputLabel === "Description" ? 10 : 0,
            paddingVertical: inputLabel === "Description" ? 7 : 16,
          },
        ]}
      >
        {icon}
        <TextInput style={defaultStyles.textInput} {...otherProps} multiline={inputLabel === "Description" ? true : false} />
        {(name === 'Password' || name === 'password' || name === 'confirmPassword') && (
          <TouchableOpacity onPress={passwordToggle} style={styles.eyeButton}>
            <MaterialCommunityIcons
              name={otherProps?.showPassword ? "eye-off" : "eye"}
              size={24}
              color={colors.medium}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(1.6),
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
  },
  eyeButton: {
    position: "absolute",
    right: wp("3%"),
    bottom: hp("1.2%")
  },
  text: {
    // textAlign: 'left',
    color: colors.black,
    fontWeight: "500",
    fontSize: hp("1.60%"),
    textTransform: "uppercase",
    marginBottom: 10,
  },
  textinput: {
    borderWidth: 1,
    padding: 16,
    borderColor: "#449F45",
    borderRadius: 30,
  },
});
