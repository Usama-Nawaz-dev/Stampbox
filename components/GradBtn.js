import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";

import ThemeContext from "../src/Context/ThemeContext";

export const GradBtn = (props) => {
  const { theme, mode } = useContext(ThemeContext);
  const {
    label,
    icon,
    loading,
    width,
    height,
    onPress,
    gradColor,
    style,
    fontSize,
    fontWeight,
    borderRadius,
    top,
    disabled,
    fontFamily,
  } = props;
  const bgColor =
    mode == "dark" ? ["#FFFFFF", "#FFFFFF"] : ["#B45436", "#BF7259"];
  return (
    <TouchableOpacity
      style={[
        {
          height: height !== undefined ? height : 50,
          width: width !== undefined ? width : "100%",
          alignSelf: "center",
          marginTop: top ? top : 30,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient
        colors={gradColor ? gradColor : bgColor}
        useAngle={true}
        angle={90}
        style={{
          height: height,
          borderRadius: borderRadius ? borderRadius : 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={"#fff"} />
        ) : (
          <Text
            style={{
              fontSize: fontSize ? fontSize : 16,
              fontWeight: fontWeight ? fontWeight : "700",
              color: mode == "dark" ? "#585755" : "#FFFFFF",
              fontFamily: fontFamily ? fontFamily : "Roboto-Regular",
              marginHorizontal: 10,
            }}
          >
            {label}
          </Text>
        )}
        {icon}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  indicator: {
    height: hp("5%"),
    width: hp("35%"),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  linearGradient: {
    padding: 16,
    width: "100%",
    alignSelf: "center",
    borderRadius: 5,
    marginTop: 10,
  },
});
