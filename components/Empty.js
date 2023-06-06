import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext } from "react";
import AppText from "./AppText";
import colors from "../constant/colors";
import ThemeContext from "../src/Context/ThemeContext";
// import { dark as theme } from "../constant/colorsConfig";
import { color } from "react-native-reanimated";

const Empty = ({ desc, retry, style }) => {
  const { theme, mode } = useContext(ThemeContext);
  // console.log('theme')
  return (
    <View style={[styles.emptyList, style]}>
      {mode == "light" ? (
        <Image
          style={styles.gifStyle}
          source={require("../assets/images/EmptyList.gif")}
        />
      ) : null}

      <AppText style={styles.emptyText}>List is Empty</AppText>
      <AppText style={[styles.record, { color: theme?.darkGrey }]}>
        {desc}
      </AppText>
      {/* <Pressable style={styles.retryButton}>
      <AppText style={{ fontSize: 12, color: colors.lightText }}>
        Retry
      </AppText>
    </Pressable> */}
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({
  emptyList: {
    height: "60%",
    // backgroundColor: 'red',
    justifyContent: "center",
    alignItems: "center",
  },
  gifStyle: {
    width: 200,
    height: 200,
  },
  emptyText: {
    fontSize: 18,
    marginTop: -15,
    // color: colors.lightText
  },
  record: {
    fontSize: 12,
    color: colors.lightText,
    marginTop: 5,
  },
  retryButton: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
  },
});
