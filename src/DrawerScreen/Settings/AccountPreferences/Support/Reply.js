import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../../../../../constant/colors";
import { styles } from "./styles";

export const Reply = ({ theme }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Pressable style={styles.reply}>
        <Text style={{ color: "#fff", fontSize: 11 }}>Reply</Text>
      </Pressable>
      <Text style={{ color: theme.davyGrey, fontSize: 12 }}>
        514 peoples found this helpful
      </Text>
    </View>
  );
};
