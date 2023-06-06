import { Text, View } from "react-native";
import React from "react";
import { styles } from "./styles";

export const ThemeDescription = ({ title, body }) => {
  return (
    <View style={styles.welcome}>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.txtBody}>{body}</Text>
    </View>
  );
};
