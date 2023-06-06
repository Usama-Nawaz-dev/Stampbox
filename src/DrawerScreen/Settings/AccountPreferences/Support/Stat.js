import { Text, View } from "react-native";
import React from "react";
import colors from "../../../../../constant/colors";

export const Stat = ({ theme, stat, label }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View
        style={{
          height: 50,
          backgroundColor: colors.lightTheme,
          width: 0.8,
          top: -5,
          left: 12,
          position: "absolute",
        }}
      />
      <View>
        <Text style={{ left: 22, fontSize: 18, color: theme.black }}>
          {stat}
        </Text>
        <Text style={{ left: 22, fontSize: 11, color: theme.highTxtColor }}>
          {label}
        </Text>
      </View>
    </View>
  );
};
