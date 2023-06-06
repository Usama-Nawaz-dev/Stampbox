import React, { useContext } from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";

import { styles } from "./styles";
import Helper from "../../../../Helper";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import { images } from "../../../../../assets/images/Images";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const TopicCard = ({ item }) => {
  return (
    <View
      style={[
        styles.shadow,
        {
          // height: hp(21),
          width: wp(45),
          borderRadius: 10,
          backgroundColor: "#fff",
          margin: wp(1.5),
        },
      ]}
    >
      <FastImage
        source={images.appImage}
        style={{
          height: hp(15),
          width: wp(45),
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          resizeMode: "contain",
        }}
      />
      <View style={{ padding: wp(2) }}>
        <AppText
          style={{
            fontSize: 12,
            fontWeight: "500",
            color: colors.lightTheme,
          }}
        >
          Topic
        </AppText>
        <AppText
          style={{ fontSize: 16, fontWeight: "500", marginTop: hp(0.2) }}
        >
          {Helper.capitalizeFirstLetter(item?.name)}
        </AppText>
      </View>
    </View>
  );
};
