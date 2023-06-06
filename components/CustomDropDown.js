import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Dropdown } from "react-native-material-dropdown";

import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";
import ThemeContext from "../src/Context/ThemeContext";

const CustomDropDown = (props) => {
  const {
    data,
    label,
    value,
    style,
    left,
    width,
    height,
    position,
    fontSize,
    borderColor,
    onChangeText,
    dropdownOffset,
  } = props;

  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={[
        {
          height: 55,
          width: "100%",
          alignSelf: "center",
          borderBottomWidth: 1,
          borderColor: borderColor ? borderColor : theme.lightGrey,
        },
        style,
      ]}
    >
      <Dropdown
        inputContainerStyle={{
          borderBottomColor: "transparent",
        }}
        value={value}
        onChangeText={(value) => onChangeText(value)}
        pickerStyle={{
          width: width ? width : "50%",
          left: left ? wp(left) : wp(25),
          height: height ? height : undefined,
          backgroundColor: theme.cardColor,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
        }}
        fontSize={fontSize ? fontSize : 14}
        textColor={theme.davyGrey}
        itemColor={theme.grey}
        baseColor={theme.dovGray}
        itemTextStyle={{ color: theme.black }}
        selectedItemColor={theme.black}
        fontFamily={Fonts.Roboto_Regular}
        dropdownPosition={position ? position : -5}
        dropdownOffset={{ top: dropdownOffset ? dropdownOffset : 25 }}
        label={label}
        data={data}
      />
    </View>
  );
};

export default CustomDropDown;

const styles = StyleSheet.create({});
