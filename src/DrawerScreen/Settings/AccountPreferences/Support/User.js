import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { styles } from "./styles";
import ThemeContext from "../../../../Context/ThemeContext";
import FastImage from "react-native-fast-image";
import { images } from "../../../../../assets/images/Images";

export const User = ({ top, left }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: left ? left : 10,
        marginTop: top ? top : 5,
      }}
    >
      <FastImage
        source={images.Profile}
        style={{
          height: 35,
          width: 35,
          borderRadius: 20,
        }}
      />
      <View
        style={{
          marginLeft: 6,
        }}
      >
        <Text style={{ fontSize: 12, color: theme.black }}>Joanna Evans</Text>
        <Text style={{ fontSize: 10, color: theme.davyGrey }}>
          22 Jan, 2023
        </Text>
      </View>
    </View>
  );
};
