import React, { useContext } from "react";
import { Text, Image, StyleSheet, View, TouchableOpacity } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";

import AppText from "./AppText";
import { StarRatings } from ".";
import Helper from "../src/Helper";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";
import { placeHolder } from "../constant/Paths";

import AuthContext from "../src/Context/AuthContext";
import ThemeContext from "../src/Context/ThemeContext";

const UserCard = (props) => {
  const {
    User,
    owner,
    nameStyle,
    rightIcon,
    imgSize = hp(4),
    starSize = hp(1.5),
  } = props;

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

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

        <View style={styles.nameSection}>
          <AppText
            style={[styles.userName, { color: theme?.darkGrey }, nameStyle]}
            numberOfLines={1}
          >
            {User
              ? User?.full_name
                ? Helper.capitalizeFirstLetter(User?.full_name)
                : Helper.capitalizeFirstLetter(User?.username)
              : "Name Not-Found"}
          </AppText>
          <StarRatings
            rating={User?.rating > 0 ? User?.rating : "0"}
            ratingStyle={{ height: starSize, width: starSize }}
          />
        </View>
      </View>
      {owner ? (
        <Text
          style={[
            styles.userName,
            {
              color: colors.green,
              marginTop: 3,
              fontWeight: "400",
            },
          ]}
        >
          {language?.owner}
        </Text>
      ) : (
        rightIcon && (
          <TouchableOpacity>
            <Entypo name="dots-three-vertical" color={"#000"} size={hp(1.6)} />
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
    marginLeft: wp(2),
  },
  userName: {
    fontSize: 12,
    color: "#3B3B3B",
    maxWidth: wp(25),
    fontFamily: Fonts.IBM_Medium,
  },
});
