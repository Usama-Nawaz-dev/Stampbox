import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../constant/colors";

const IconContainer = ({ height, width, icon, counter, backgroundColor, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}
      style={{
        height: height ? height : 36,
        width: width ? width : 36,
        borderRadius: 10,
        backgroundColor: backgroundColor ? backgroundColor : "rgba(255,255,255,.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {counter == 0 || counter ? (
        <View
          style={{
            height: 15,
            width: 15,
            borderRadius: 10,
            backgroundColor: colors.theme,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: -5,
            right: -5,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 9 }}>{counter}</Text>
        </View>
      ) : null}
      {icon && icon}
    </TouchableOpacity>
  );
};

export default IconContainer;

const styles = StyleSheet.create({});
