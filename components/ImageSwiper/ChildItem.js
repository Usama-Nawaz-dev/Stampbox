import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import FastImage from "react-native-fast-image";

export const ChildItem = (props) => {
  const { item, style, index, imageKey, height, onPress, resizeMode } = props;
  return (
    <Pressable onPress={() => onPress(index, item)}>
      <FastImage
        style={[styles.image, style, { height: height }]}
        source={{ uri: item[imageKey] }}
        resizeMode={resizeMode ? resizeMode : FastImage.resizeMode.contain}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 230,
  },
});
