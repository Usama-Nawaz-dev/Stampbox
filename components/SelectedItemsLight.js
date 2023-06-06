import { StyleSheet, Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import React from "react";
import colors from "../constant/colors";

const SelectedItemsLight = ({ item, bg, font, onPress, current, index }) => {
    console.log('countries', current[index]?.isSelected)

  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row" }}>
      <View
        style={{
          height: 30,
          //   width: 100,
          maxWidth: 100,
          backgroundColor: current[index]?.isSelected ? null : bg,
          borderColor: current[index]?.isSelected ? colors.theme : "lightgrey",
          borderWidth: 1.5,
          borderRadius: current[index]?.isSelected ? 5 : 30,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 5,
        }}
      >
        <Text numberOfLines={1} style={{ color: font }}>
          {"  "}
          {item.value}
          {"  "}
        </Text>
      </View>
    </Pressable>
  );
};

export default SelectedItemsLight;

const styles = StyleSheet.create({});
