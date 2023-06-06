import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "./AppText";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";

import Feather from "react-native-vector-icons/Feather";
import ThemeContext from "../src/Context/ThemeContext";
const InputButton = (props) => {
  const {
    onPress,
    placeHolder,
    selected,
    height,
    style,
    showIcon = true,
    label,
    fontSize,
  } = props;

  const { theme, mode } = useContext(ThemeContext);

  return (
    <View
      style={[
        {
          height: height ? height : 60,
          borderColor: theme.lightGrey,
          justifyContent: "center",
          borderBottomWidth: 1,
          // backgroundColor: 'orange',
          width: "100%",
          alignSelf: "center",
        },
        style,
      ]}
    >
      {selected && label ? (
        <AppText
          style={{
            fontSize: 12,
            color: theme.dovGray,
            fontFamily: Fonts.Roboto_Regular,
            top: 10,
          }}
        >
          {label}
        </AppText>
      ) : null}
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: selected && label ? 15 : 15,
          // marginTop: 5
        }}
      >
        <AppText
          style={{
            color: selected ? theme.davyGrey : theme.dovGray,
            fontFamily: Fonts.Roboto_Regular,
            fontSize: fontSize ? fontSize : 14,
          }}
        >
          {placeHolder}
        </AppText>
        {showIcon ? (
          <Feather
            name="chevron-down"
            size={20}
            style={{ marginTop: 3 }}
            color={theme.dovGray}
          />
        ) : (
          <Feather
            name="calendar"
            size={15}
            style={{ marginTop: 3 }}
            color={colors.lightTheme}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default InputButton;

const styles = StyleSheet.create({});
