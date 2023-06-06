import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../../../constant/colors";

const FlagAction = ({
  title,
  otherTitle,
  action,
  otherAction,
  single,
  width,
}) => {
  return (
    <View style={styles.main}>
      {single ? (
        <Pressable
          onPress={otherAction}
          style={[styles.btnStyle, { width: width ? width : 70 }]}
        >
          <Text style={{ color: "#fff" }}>{otherTitle}</Text>
        </Pressable>
      ) : (
        <>
          <Pressable
            onPress={action}
            style={[styles.btnStyle, { backgroundColor: colors.danger }]}
          >
            <Text style={{ color: "#fff" }}>{title}</Text>
          </Pressable>
          <Pressable onPress={otherAction} style={styles.btnStyle}>
            <Text style={{ color: "#fff" }}>{otherTitle}</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export { FlagAction };

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    alignSelf: "flex-end",
    // backgroundColor: "orange",
    height: 45,
    alignItems: "flex-end",
    right: 5,
    // justifyContent: 'flex-start'
  },
  btnStyle: {
    width: 70,
    height: 25,
    backgroundColor: colors.green,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
});
