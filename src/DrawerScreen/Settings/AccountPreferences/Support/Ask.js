import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../../../../../constant/colors";
import { styles } from "./styles";

export const Ask = ({ theme }) => {
  return (
    <>
      <Text
        style={[
          styles.txtBody,
          {
            color: theme.davyGrey,
            textAlign: "left",
            paddingHorizontal: 0,
            marginTop: 5,
            fontWeight: "500",
            fontSize: 13,
          },
        ]}
      >
        Was this reply helpful to you?
      </Text>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <Text style={styles.ask}>Yes</Text>
        <Text style={styles.ask}>No</Text>
      </View>
    </>
  );
};
