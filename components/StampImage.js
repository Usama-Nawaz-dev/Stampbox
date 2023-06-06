import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { images } from "../assets/images/Images";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import colors from "../constant/colors";

const StampImage = (props) => {
  const { uri, onDelete } = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDelete}>
        <FastImage
          resizeMode="contain"
          tintColor={colors.red}
          source={images.Remove}
          style={styles.imgIcon}
        />
      </TouchableOpacity>
      {!uri && (
        <FastImage
          source={require("../assets/images/onboard3.png")}
          style={styles.img}
          resizeMode="contain"
        />
      )}
      {uri && (
        <FastImage
          source={{ uri: uri }}
          style={styles.img}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

export default StampImage;

const styles = StyleSheet.create({
  container: {
    width: wp(43),
    borderWidth: 1,
    padding: wp(1),
    borderRadius: 8,
    borderColor: "grey",
    justifyContent: "center",
  },
  img: {
    width: wp(35),
    height: hp(15),
    marginTop: hp(2),
    alignSelf: "center",
    borderRadius: 5,
  },
  imgIcon: {
    top: 0,
    right: 0,
    zIndex: 999,
    width: hp(2.8),
    height: hp(3.8),
    tintColor: "red",
    position: "absolute",
  },
});
