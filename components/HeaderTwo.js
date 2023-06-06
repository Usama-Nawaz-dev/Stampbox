import { StyleSheet, Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import SearchBar from "./SearchBar";

const HeaderTwo = (props) => {
  return (
    <View
      style={{
        backgroundColor: "lightgrey",
        justifyContent: "space-between",
        flexDirection: "row",
      }}
    >
      <Text
        style={{
          fontSize: 21,
          fontWeight: props?.weight !== undefined ? props?.weight : "400",
          margin: 20,
        }}
      >
        {props.title}
      </Text>
      <Pressable
        onPress={props.onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: 10,
        }}
      >
        <Text
          style={{
            fontSize: 21,
            fontWeight: "400",
          }}
        >
          {props.title2}
        </Text>
        <Icon name="arrow-forward" size={21} />
      </Pressable>
    </View>
  );
};

export default HeaderTwo;

const styles = StyleSheet.create({});
