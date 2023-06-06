import React, { useContext, useState } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
// import { styles } from "./styles";
import HomeTopTab from "../../components/HomeTopTab";
import { images } from "../../assets/images/Images";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import colors from "../../constant/colors";
import AppText from "../../components/AppText";

import Helper from "../Helper";
import { useDispatch, useSelector } from "react-redux";
import allActions from "../../redux/actions";
import locals from "./locals";
import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

const FeedsShortcuts = (props) => {
  const {
    myState: { language },
  } = useContext(AuthContext);
  // console.log("feedShortcut....", language);
  const { theme, mood } = useContext(ThemeContext);

  const tabs = [
    { name: language?.allFeeds, icon: locals.feed_img },
    { name: language?.AUCTION, icon: locals.auction_img },
    { name: language?.TRADE, icon: locals.trade_img },
    { name: language?.bounty, icon: locals.bounty_img },
    { name: "Post", icon: locals.post_img },
    { name: language?.events, icon: locals.events_img },
    { name: "Product", icon: locals.product_img },
    // { name: "Flags", icon: locals.flag_img },
  ];

  const { setFilter, logOut } = props;
  const dispatch = useDispatch();

  const filterFunc = async (type) => {
    dispatch(allActions.ApiAction.setFeedLoad(true));
    await dispatch(allActions.ApiAction.getFeeds(null, logOut, type));
    setFilter(type);
    dispatch(allActions.ApiAction.setFeedLoad(false));
  };
  const onTabPress = async (item) => {
    // console.log(item.name);
    if (item.name == language?.allFeeds) {
      filterFunc(null);
    } else if (item.name == language?.AUCTION) {
      filterFunc("Auction");
    } else if (item.name == language?.TRADE) {
      filterFunc("Trade");
    } else if (item.name == "Post") {
      filterFunc("Post");
    } else if (item.name == "Product") {
      filterFunc("Product");
    } else if (item.name == language?.events) {
      filterFunc("Event");
    } else if (item.name == language?.bounty) {
      filterFunc("Bounty");
    } else if (item.name == "Flags") {
      filterFunc("FlagTicket");
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <AppText
        style={{
          left: wp(3),
          fontSize: 18,
          bottom: hp(0.5),
          fontWeight: "500",
          color: theme?.black,
        }}
      >
        {language?.feedShortcuts}
      </AppText>
      <FlatList
        data={tabs}
        horizontal
        style={{ paddingLeft: wp(3) }}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <View>
              <TouchableOpacity
                key={item}
                onPress={() => onTabPress(item)}
                style={styles.itemSection}
              >
                {item.icon(theme.black, theme.black)}

                <AppText style={[styles.text, { color: theme.black }]}>
                  {item.name}
                </AppText>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default FeedsShortcuts;

const styles = StyleSheet.create({
  container: {
    paddingTop: hp(1),
    backgroundColor: colors.cWhite,
  },
  itemSection: {
    height: hp(7.5),
    marginRight: wp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: hp(1),
    height: hp(1),
    tintColor: colors.cBlack,
  },
  text: {
    fontFamily: "IBMPlexSans-Regular",
    color: colors.lightText,
    marginTop: hp(0.5),
    maxWidth: wp(18),
    fontSize: 12,
  },
});
