import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const TabButton = (props) => (
  <TouchableOpacity
    onPress={props.onPress}
    // activeOpacity={0.9}
    // style={{ backgroundColor: 'orange' }}
  >
    <Image
      source={props.img}
      style={{
        height: props?.height !== undefined ? props?.height : 50,
        width: props?.width !== undefined ? props?.width : 50,
        resizeMode: "contain",
        top: props?.top !== undefined ? props?.top : null,
        // marginHorizontal: wp(3.2),
        bottom: props?.bottom !== undefined ? props?.bottom : null,
        // bottom: 35,
      }}
    />
  </TouchableOpacity>
);

export default TabButton;

const styles = StyleSheet.create({});
