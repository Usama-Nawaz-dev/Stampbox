import React from "react";
import { Text, Image, StyleSheet, View, TouchableOpacity } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Entypo from "react-native-vector-icons/Entypo";
import Btn from "./Btn";
import AppText from "./AppText";

import { placeHolder } from "../constant/Paths";
import colors from "../constant/colors";
import { StarRatings } from ".";

const stars = [1, 2, 3, 4, 5];

const UserCard = (props) => {
  const {
    imgSize = 35,
    nameStyle,
    rightIcon,
    owner,
    starSize = 12,
    ratingStyle,
    starColor,
    User,
  } = props;
  // console.log('User', User)
  return (
    <View style={styles.cardHeader}>
      <View style={styles.upperSection}>
        {User?.image_url ? (
          <Image
            style={[styles.userImg, { width: imgSize, height: imgSize }]}
            source={{ uri: User?.image_url }}
          />
        ) : (
          <Image
            style={[styles.userImg, { width: imgSize, height: imgSize }]}
            source={placeHolder}
          />
        )}
      </View>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: 'center',
    // backgroundColor: 'red'
  },
  upperSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImg: {
    borderRadius: 100,
  },
  nameSection: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 12,
    fontFamily: "IBMPlexSans-Regular",
    fontWeight: "500",
    color: "#3B3B3B",
    maxWidth: wp(25),
  },
});
