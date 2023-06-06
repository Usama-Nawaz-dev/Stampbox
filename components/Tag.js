import React from "react";
import { TouchableOpacity, View, Pressable, StyleSheet } from "react-native";

import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import colors from "../constant/colors";
import AppText from "./AppText";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const Tag = (props) => {
  const { item, onPress } = props;
  return (
    <View style={styles.container}>
      <AppText style={styles.text} numberOfLines={1}>
        {item}
      </AppText>
      <TouchableOpacity style={styles.icon} onPress={onPress}>
        <EvilIcons name="close" color={"#FFFFFF"} size={wp(3)} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(191, 114, 89, 0.2)",
    height: 25,
    borderRadius: 5,
    // maxWidth: wp(50),
    marginRight: 5,
    marginBottom: wp(1.5),
    paddingHorizontal: 3,
  },
  icon: {
    height: 16,
    width: 16,
    backgroundColor: "#BF7259",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    marginRight: wp(1.5),
    color: "#BF7259",
    maxWidth: wp(30),
  },
});
