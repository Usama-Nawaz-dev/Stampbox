import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import Image from "react-native-fast-image";

import colors from "../../constant/colors";
import ThemeContext from "../Context/ThemeContext";
import { images } from "../../assets/images/Images";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const MarketTab = ({ index, focused }) => {
  const { theme } = useContext(ThemeContext);

  const iconChecker = (index, label) => {
    if (index == 0) {
      return label ? "All" : images.All;
    } else if (index == 1) {
      return label ? "Trade" : images.Trade;
    } else if (index == 2) {
      return label ? "Auction" : images.Auction;
    } else if (index == 3) {
      return label ? "Bounty" : images.Bounty;
    } else if (index == 4) {
      return label ? "Sale" : images.Sale;
    } else if (index == 5) {
      return label ? "Supplies" : images.Supplies;
    } else if (index == 6) {
      return label ? "Discounted Items" : images.Sale;
    } else if (index == 7) {
      return label ? "Explore Stores" : images.Store;
    }
  };
  // console.log("focused", focused);
  return (
    <View
      style={[
        styles.tabIcon,
        { backgroundColor: focused ? colors.tab : theme?.white },
      ]}
    >
      <Image
        resizeMode="contain"
        source={iconChecker(index)}
        style={{
          height: hp(3),
          width: hp(3),
        }}
        tintColor={focused ? colors.lightTheme : theme?.darkGrey}
      />
      <Text
        style={{
          color: focused ? colors.lightTheme : theme?.black,
          fontSize: 12,
          textAlign: 'center'
        }}
        numberOfLines={2}
      >
        {iconChecker(index, true)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    width: wp(17.5),
    height: wp(17.5),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
