import { Text, View } from "react-native";
import React, { useContext } from "react";
import { Stat } from "./Stat";
import { styles } from "./styles";
import ThemeContext from "../../../../Context/ThemeContext";

export const StatCard = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={[
        styles.shadow,
        {
          height: 120,
          width: "92%",
          borderRadius: 10,
          marginTop: 15,
          backgroundColor: theme.cardColor,
          alignSelf: "center",
          padding: 10,
        },
      ]}
    >
      <Text
        style={[
          styles.heading,
          { color: theme.highTxtColor, textAlign: "left", margin: 10 },
        ]}
      >
        Community Stats
      </Text>
      <View
        style={{
          flexDirection: "row",
          width: "70%",
          justifyContent: "space-between",
        }}
      >
        <Stat theme={theme} stat={"514"} label={"Views last month"} />
        <Stat theme={theme} stat={"05"} label={"Conversations"} />
      </View>
    </View>
  );
};
