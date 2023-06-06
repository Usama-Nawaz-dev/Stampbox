import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import React from "react";
import colors from "../constant/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SelectedItems = ({ item, remove, minWidth }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "rgba(191, 114, 89, 0.2)",
          minWidth: minWidth ? minWidth : wp(20),
          alignItems: "center",
          marginRight: wp(3),
          borderRadius: 30,
          maxWidth: wp(40),
          paddingLeft: 10,
          paddingRight: 5,
          height: 30,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            color: "#BF7259",
            fontFamily: "Roboto-Regular",
            fontSize: 14,
            maxWidth: wp(30),
            paddingRight: 5,
          }}
        >
          {item}
        </Text>
        <TouchableOpacity
          onPress={() => remove(item)}
          style={{
            height: 20,
            width: 20,
            backgroundColor: "#BF7259",
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EvilIcons name="close" size={20} color={colors.cWhite} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectedItems;

const styles = StyleSheet.create({});
