import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";

const AuthBtn = ({ icon, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 55,
        width: 55,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(145, 135, 112, .2)",
        borderRadius: 30,
      }}
    >
      {icon}
    </TouchableOpacity>
  );
};

export default AuthBtn;

const styles = StyleSheet.create({});
