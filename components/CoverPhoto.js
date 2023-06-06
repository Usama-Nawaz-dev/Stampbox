import React from "react";
import { View, Pressable, Image, StyleSheet } from "react-native";
import AppText from "./AppText";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../constant/colors";

function CoverPhoto(props) {
  const { uri, onPress, btnText, showEdit, theme } = props;

  return (
    <Pressable
      style={[
        styles.uploadSection,
        {
          height: uri ? hp(16) : hp(14),
          backgroundColor: theme ? theme.bg : colors.background,
        },
      ]}
      onPress={onPress}
    >
      {uri ? (
        <Image style={styles.img} source={{ uri: uri }} />
      ) : (
        <View
          style={[
            styles.uploadBtn,
            { borderColor: theme ? theme.black : "#000" },
          ]}
        >
          <MaterialCommunityIcons
            name="image-multiple"
            size={hp(2.2)}
            color={theme ? theme.black : "#222"}
          />
          <AppText
            style={[styles.text, { color: theme ? theme.black : "#222" }]}
          >
            {btnText ? btnText : "Upload Store Photo"}
          </AppText>
        </View>
      )}
      {showEdit && (
        <View style={styles.editBtn}>
          <MaterialIcons name="edit" size={hp(2.4)} />
        </View>
      )}
    </Pressable>
  );
}

export default CoverPhoto;

const styles = StyleSheet.create({
  uploadSection: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: colors.background,
  },
  uploadBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 7,
    borderWidth: 1,
    borderRadius: hp(10),
  },
  img: {
    height: "100%",
    width: wp(28),
  },
  text: {
    fontSize: 12,
    marginLeft: wp(2),
  },
  editBtn: {
    position: "absolute",
    top: wp(3),
    right: wp(3),
  },
});
