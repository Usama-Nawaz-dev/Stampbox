import React, { useContext } from "react";
import { Pressable, Text, View } from "react-native";

import { styles } from "./styles";
import colors from "../../../../../constant/colors";
import Fonts from "../../../../../assets/fonts/Fonts";
import ThemeContext from "../../../../Context/ThemeContext";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import FastImage from "react-native-fast-image";
import { images } from "../../../../../assets/images/Images";
import Helper from "../../../../Helper";

export const TopicBtn = ({ item, onPress }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: hp(12),
        width: hp(12),
        borderRadius: 10,
        backgroundColor: "#f2f2f2",
        alignItems: "center",
        justifyContent: "center",
        margin: wp(2),
      }}
    >
      <View
        style={{
          width: hp(4.3),
          height: hp(4.3),
          alignItems: "center",
          borderRadius: hp(10),
          justifyContent: "center",
          backgroundColor: "rgba(128,128,128, 0.15)",
        }}
      >
        <FastImage
          source={images.Market}
          style={{
            height: hp(2.4),
            width: hp(2.4),
            resizeMode: "contain",
          }}
        />
      </View>
      <Text
        style={[
          styles.heading,
          {
            color: "#000",
            fontSize: 12,
            marginTop: 5,
            width: hp(11),
            fontWeight: "500",
          },
        ]}
      >
        {Helper.capitalizeFirstLetter(item?.name)}
      </Text>
    </Pressable>
  );
};
