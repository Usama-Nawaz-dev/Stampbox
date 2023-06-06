import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../constant/colors";

import AppText from "./AppText";

const BorderBtn = ({
  label,
  icon,
  loading,
  width,
  height,
  onPress,
  color,
  fontColor,
  bold = true,
  fontSize,
  borderWidth,
  backgroundColor,
  noRadius,
  disabled,
  top,
  marginHorizontal,
  index,
  radius,
  fontFamily,
}) => {
  return (
    <TouchableOpacity
      key={index}
      disabled={disabled}
      onPress={onPress}
      style={{
        height: height !== undefined ? height : 60,
        width: width !== undefined ? width : "90%",
        borderRadius: radius ? radius : noRadius ? null : 30,
        backgroundColor: backgroundColor ? backgroundColor : "#fff",
        borderWidth: borderWidth ? borderWidth : 1,
        borderColor: color !== undefined ? color : "#fff",
        // flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: top ? top : null,
        marginHorizontal: marginHorizontal ? marginHorizontal : null,
      }}
    >
      {!loading ? (
        <Text
          numberOfLines={1}
          style={{
            fontSize: fontSize !== undefined ? fontSize : 18,
            fontWeight: bold ? "600" : null,
            color: fontColor !== undefined ? fontColor : "#fff",
            marginHorizontal: 10,
            fontFamily: fontFamily ? fontFamily : "Roboto-Regular",
          }}
        >
          {label}
        </Text>
      ) : (
        <ActivityIndicator
          // style={{ bottom: hp(-1) }}
          size="small"
          color={colors.theme}
        />
      )}
    </TouchableOpacity>
  );
};

export default BorderBtn;

const styles = StyleSheet.create({
  indicator: {
    height: hp("5%"),
    width: hp("35%"),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: 'red',
    // bottom: hp(-5)
  },
});
