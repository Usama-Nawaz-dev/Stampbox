import React, { useContext, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AppText from "../AppText";

import colors from "../../constant/colors";
import UserCard from "../UserCard";
import ThemeContext from "../../src/Context/ThemeContext";
import { images } from "../../assets/images/Images";
// import { dark as theme } from '../../constant/colorsConfig';

export const MarketCard = (props) => {
  const { ItemDetail, onPress, borderWidth, name, user } = props;
  let mediaUri = null;
  if (ItemDetail?.type === "Lot") {
    mediaUri = ItemDetail?.image_url ? ItemDetail?.image_url : null;
  } else {
    mediaUri = ItemDetail?.medias?.length
      ? ItemDetail?.medias[0]?.media_url
      : null;
  }
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderWidth: borderWidth ? borderWidth : 0,
          backgroundColor: theme?.cardColor,
        },
      ]}
      onPress={onPress}
    >
      <Image
        style={styles.stampImg}
        resizeMode="contain"
        source={{ uri: mediaUri }}
      />
      <AppText style={styles.nameText} numberOfLines={2}>
        {name ? name : ItemDetail?.name}
      </AppText>
      <View style={styles.bottomSection}>
        <UserCard
          starColor={colors.theme}
          User={user ? user : ItemDetail?.user}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
    width: wp(45),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    borderRadius: 10,
    padding: 5,
    borderColor: colors.theme,
    marginRight: wp(3),
    marginTop: hp(1.5),
  },
  stampImg: {
    width: "100%",
    height: 140,
  },

  nameText: {
    fontFamily: "IBMPlexSans-Regular",
    fontWeight: "500",
    // color: colors.heading,
    paddingVertical: 5,
  },
  bottomSection: {
    // alignItems: 'center',
    marginLeft: 5,
    borderTopWidth: 1,
    borderColor: colors.borderColor,
    paddingTop: 2,
  },
});
