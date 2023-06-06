import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";
import Feather from "react-native-vector-icons/Feather";
import ThemeContext from "../src/Context/ThemeContext";

const OnlyDropDown = (props) => {
  const {
    data,
    label,
    onChangeText,
    value,
    style,
    width,
    position,
    dropdownOffset,
    left,
    height,
    iconRight,
    icon,
  } = props;

  const { theme, mode } = useContext(ThemeContext);

  return (
    <Dropdown
      inputContainerStyle={{
        borderBottomColor: "transparent",
      }}
      value={value}
      onChangeText={(value) => onChangeText(value)}
      pickerStyle={{
        width: width ? width : "50%",
        height: height ? height : undefined,
        backgroundColor: theme.cardColor,
        left: left ? wp(left) : wp(25),
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
      }}
      fontSize={16}
      textColor={theme.black}
      itemColor={theme.black}
      baseColor={theme.black}
      itemTextStyle={{ color: theme.black }}
      selectedItemColor={theme.black}
      fontFamily={Fonts.Roboto_Regular}
      dropdownPosition={position ? position : -5}
      dropdownOffset={{ top: dropdownOffset ? dropdownOffset : 25 }}
      label={label}
      data={data}
      iconRight={iconRight ? iconRight : null}
      icon={icon}
    />
  );
};

export default OnlyDropDown;

const styles = StyleSheet.create({});
