import React, { useState, useContext } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import { images } from "../../assets/images/Images";

import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";

import Helper from "../Helper";
import allActions from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
// import { dark as theme } from "../../constant/colorsConfig";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const TopView = ({ navigation, storeInfo }) => {
  const { myState } = useContext(AuthContext);
  const { language } = myState;
  const { theme, mood } = useContext(ThemeContext);
  // const
  // let { en: language } = Languages;
  // console.log("lang", eng);

  const tabs = [
    { name: language?.albums, uri: images.Album },
    { name: language?.auctions, uri: images.Auction },
    { name: language?.TRADE, uri: images.Trade },
    // { name: language?.marketplace, uri: images.Market },
    { name: language?.network, uri: images.Newtwork },
    { name: language?.reports, uri: images.Report },
    { name: language?.events, uri: images.Events },
    { name: language?.STORE, uri: images.Store },
    { name: language?.exhibition, uri: images.Exhibition },
    { name: language?.clubs, uri: images.Clubs },
    { name: language?.listed, uri: images.List },
  ];

  // console.log('props--->', navigation)
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  // console.log('userStore', currentUser)

  const { openPermissionSheet } = useContext(AuthContext);
  const canAccessStore =
    currentUser?.user_permissions?.includes("my_store.crud");

  const onTabPress = async (item) => {
    // console.log(item.name);
    if (item.name == language?.albums) {
      Helper.fbEvent("open_album_from_home");
      dispatch(allActions.DataAction.CollectionType("Album"));
      navigation.navigate("AlbumStack");
    } else if (item.name == language?.auctions) {
      dispatch(allActions.SheetAction.initialRoute("Auction_Stack"));
      navigation.navigate("Generals");
      // navigation.reset({ index: 0, routes: [{ name: "AuctionStack" }] });
    } else if (item.name == language?.TRADE) {
      dispatch(allActions.SheetAction.initialRoute("Trade_Stack"));
      navigation.navigate("Generals");
      // navigation.reset({ index: 0, routes: [{ name: "TradeStack" }] });
    } else if (item.name == language?.marketplace) {
      navigation.navigate("Market");
    } else if (item.name == language?.network) {
      navigation.navigate("MyNetwork", { initialRoute: "Follwers" });
    } else if (item.name == "Reports") {
      navigation.navigate("MyReports");
    } else if (item.name == language?.events) {
      dispatch(allActions.SheetAction.EventType("Event"));
      dispatch(allActions.SheetAction.initialRoute("Events"));
      navigation.navigate("Generals");
      // navigation.reset({ index: 0, routes: [{ name: "GeneralStack" }] });
    } else if (item.name == language?.STORE) {
      // navigation.navigate("CreateStore");
      // navigation.navigate("StoreStack", { screen: "CreateStore" });
      if (storeInfo !== null || currentUser?.store) {
        // console.log("not null-->", storeInfo);
        // navigation.reset({ index: 0, routes: [{ name: "MyStoreStack" }] });
        // navigation.navigate("MyStore");
        if (canAccessStore) {
          Helper.fbEvent("open_store_from_main_screen");
          dispatch(allActions.DetailAction.StoreDetail(currentUser?.store));
          navigation.navigate("MyStoreStack", { screen: "MyStore" });
        } else {
          openPermissionSheet();
        }
      } else {
        // console.log("null", storeInfo);
        navigation.navigate("CreateStore");
        // navigation.navigate("MyStoreStack", { screen: "CreateStore" });
      }
    } else if (item.name == language?.exhibition) {
      dispatch(allActions.SheetAction.EventType("Exhibition"));
      dispatch(allActions.SheetAction.initialRoute("Events"));
      navigation.navigate("Generals");
      // navigation.reset({ index: 0, routes: [{ name: "GeneralStack" }] });
    } else if (item.name == language?.clubs) {
      navigation.navigate("ClubsStack");
    } else if (item.name == language?.listed) {
      dispatch(allActions.SheetAction.initialRoute("MyItem_Stack"));
      navigation.navigate("Generals");
      // navigation.reset({ index: 0, routes: [{ name: "MyItemStack" }] });
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <AppText
        style={{
          fontWeight: "500",
          fontSize: 18,
          left: wp(3),
          bottom: hp(0.5),
          color: theme?.black,
        }}
      >
        {language.shortcuts}
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
                <FastImage
                  source={item.uri}
                  style={styles.icon}
                  resizeMode="contain"
                  tintColor={theme?.black}
                />
                <AppText
                  style={[styles.text, { color: theme?.black }]}
                  numberOfLines={1}
                >
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

export default TopView;

const styles = StyleSheet.create({
  container: {
    paddingTop: hp(1),
  },
  itemSection: {
    height: hp(7.5),
    marginRight: wp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: hp(3),
    height: hp(3),
  },
  text: {
    fontFamily: "IBMPlexSans-Regular",
    color: colors.lightText,
    marginTop: hp(0.5),
    maxWidth: wp(18),
    fontSize: 12,
  },
});
