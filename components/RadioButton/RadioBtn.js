import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { light as theme } from "../../constant/colorsConfig";

const RadioBtn = ({ size, color, onPress, selected }) => {
  return (
    <Pressable
      style={{
        height: size ? size : 40,
        width: size ? size : 40,
        borderRadius: size ? size : 40,
        borderWidth: 2,
        borderColor: selected ? (color ? color : theme.theme) : "grey",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      {selected && (
        <View
          style={{
            height: size ? size - 15 : 25,
            width: size ? size - 15 : 25,
            backgroundColor: color ? color : theme.theme,
            borderRadius: size ? size : 40,
          }}
        />
      )}
    </Pressable>
  );
};

export { RadioBtn };

const styles = StyleSheet.create({});
