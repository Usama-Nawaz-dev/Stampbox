import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import AppText from "../../../components/AppText";

import { styles } from "./styles";
import TradeCard from "../../../components/TradeCard";
import AuctionCard from "../../../components/AuctionCard";
import SalesCard from "../../../components/SalesCard";

import { EmptyList } from "../../../components";
import { SwiperCard } from "../../../components";
import { BountyCard } from "../BountiesTab/BountyCard";
import { SuppliesCard } from "../SuppliesTab/SuppliesCard";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import allActions from "../../../redux/actions";
import Helper from "../../Helper";
import AuthContext from "../../Context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import {
  toggleFav,
  toggleBookmark as onTradeMark,
  getSupplies,
  getBounties,
  getAuctions,
  getSales,
  getTrades,
} from "../locals";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

export const AllTab = ({ navigation }) => {
  const [suppliesList, setSuppliesList] = useState(null);
  const [salesList, setSalesList] = useState(null);
  const [bountiesList, setBountiesList] = useState(null);
  const [auctionList, setAuctionList] = useState(null);
  const [tradesList, setTradesList] = useState(null);
  const listData = [
    suppliesList,
    salesList,
    bountiesList,
    auctionList,
    tradesList,
  ];
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const dispatch = useDispatch();
  const focused = useIsFocused();

  useEffect(() => {
    if (focused) {
      listSetter();
    }
  }, [focused]);

  async function listSetter() {
    dispatch(allActions.DataAction.AppLoader(true));
    let supplies = await getSupplies();
    let sales = await getSales();
    dispatch(allActions.DataAction.AppLoader(false));
    let bounties = await getBounties();
    let auctions = await getAuctions();
    let trades = await getTrades();
    if (supplies?.length) {
      setSuppliesList(supplies);
    }
    if (bounties?.length) {
      setBountiesList(bounties);
    }
    if (auctions?.length) {
      setAuctionList(auctions);
    }
    if (sales?.length) {
      setSalesList(sales);
    }
    if (trades?.length) {
      setTradesList(trades);
    }
  }
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme?.white }]}>
      {/* <View style={styles.itemSection}>
        <View style={styles.upperSection}>
          <AppText style={styles.heading}>{language?.suggested + " " + language?.for + " " + language?.you}</AppText>
        </View>
        <View style={styles.lowerSection}>
          <SwiperCard />
        </View>
      </View> */}
      <View style={styles.itemSection}>
        <View style={styles.upperSection}>
          <AppText style={styles.heading}>{language?.supplies}</AppText>
          <TouchableOpacity onPress={() => navigation.navigate("Supplies")}>
            <AppText style={styles.btnText}>{language?.showMore}</AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.lowerSection}>
          {!listData[0]?.length ? (
            <EmptyList description={language?.YouDontHhaveAanyActiveItem} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {listData[0]?.map((item, index) => {
                return (
                  <View style={{ marginRight: 10 }}>
                    <SuppliesCard
                      ItemDetail={item}
                      onPressBtn={() => {
                        Helper.fbEvent("supply_open_from_market");
                        dispatch(allActions.DetailAction.StampDetail(item));
                        navigation.navigate("ProductStack");
                      }}
                      onPressUser={() => {
                        Helper.fbEvent("open_profile_from_market");
                        // navigation.navigate("OtherUser", { user: item?.user });
                        dispatch(allActions.DetailAction.OtherUser(item?.user));
                        navigation.navigate("ProfileStack");
                      }}
                      onToggleFav={async () => {
                        const update = await toggleFav(
                          item?.id,
                          suppliesList,
                          "Product",
                          language
                        );
                        setSuppliesList(update);
                      }}
                      gotoChat={() => {
                        let name = item?.user?.full_name
                          ? item?.user?.full_name
                          : item?.user?.first_name;
                        // console.log('item', item);
                        item.type = item?.user?.id;
                        item.from = name;
                        item.message = item?.user?.image_url;
                        dispatch(allActions.SheetAction.user_chat(item));
                        navigation.navigate("ChatScreen");
                        // navigation.reset({
                        //   index: 0,
                        //   routes: [{ name: "ChatScreen" }],
                        // });
                      }}
                      onFlag={() => {
                        navigation.navigate("Flagging", {
                          id: item?.productable?.id,
                        });
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
      <View style={styles.itemSection}>
        <View style={styles.upperSection}>
          <AppText style={styles.heading}>{language?.forSale}</AppText>
          <TouchableOpacity onPress={() => navigation.navigate("Sales")}>
            <AppText style={styles.btnText}>{language?.showMore}</AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.lowerSection}>
          {!listData[1]?.length ? (
            <EmptyList description={language?.YouDontHhaveAanyActiveItem} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {listData[1]?.map((item, index) => {
                // console.log("item->sale", item);
                return (
                  <View style={{ marginRight: 10 }}>
                    <SalesCard
                      ItemDetail={item}
                      onBuyNow={() => {
                        if (item?.productable_type === "StampItem") {
                          Helper.fbEvent("product_open_from_market");
                          Helper.fbEvent("product_open_from_sale");
                        } else {
                          Helper.fbEvent("supply_open_from_market");
                          Helper.fbEvent("supply_open_from_sale");
                        }
                        dispatch(allActions.DetailAction.StampDetail(item));
                        navigation.navigate("ProductStack");
                      }}
                      gotoChat={() => {
                        let name = item?.user?.full_name
                          ? item?.user?.full_name
                          : item?.user?.first_name;
                        // console.log('item', item);
                        item.type = item?.user?.id;
                        item.from = name;
                        item.message = item?.user?.image_url;
                        dispatch(allActions.SheetAction.user_chat(item));
                        navigation.navigate("ChatScreen", { item });
                        // navigation.reset({
                        //   index: 0,
                        //   routes: [{ name: "ChatScreen" }],
                        // });
                      }}
                      onPressFlag={() => {
                        navigation.navigate("Flagging", {
                          id: item?.productable?.id,
                        });
                      }}
                      onToggleFav={async () => {
                        const update = await toggleFav(
                          item?.id,
                          salesList,
                          "Product",
                          language
                        );
                        setSalesList(update);
                      }}
                      onPressUser={() => {
                        dispatch(allActions.DetailAction.OtherUser(item?.user));
                        navigation.navigate("ProfileStack");
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
      <View style={styles.itemSection}>
        <View style={styles.upperSection}>
          <AppText style={styles.heading}>{language?.bounties}</AppText>
          <TouchableOpacity onPress={() => navigation.navigate("Bounty")}>
            <AppText style={styles.btnText}>{language?.showMore}</AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.lowerSection}>
          {!listData[2]?.length ? (
            <EmptyList description={language?.YouDontHhaveAanyActiveItem} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {listData[2]?.map((item, index) => {
                // console.log('item->bounty', item)
                return (
                  <View style={{ marginRight: 10 }}>
                    <BountyCard
                      ItemDetail={item}
                      onPressHunt={() => {
                        dispatch(allActions.DetailAction.BountyDetail(item));
                        navigation.navigate("BountyStack", {
                          screen: "BountyDetail",
                          params: { ItemDetail: item },
                        });
                      }}
                      onPressUser={() => {
                        Helper.fbEvent("open_profile_from_market");
                        // navigation.navigate("OtherUser", { user: item?.user });
                        dispatch(allActions.DetailAction.OtherUser(item?.user));
                        navigation.navigate("ProfileStack");
                      }}
                      gotoChat={() => {
                        let name = item?.user?.full_name
                          ? item?.user?.full_name
                          : item?.user?.first_name;
                        // console.log('item', item);
                        item.type = item?.user?.id;
                        item.from = name;
                        item.message = item?.user?.image_url;
                        dispatch(allActions.SheetAction.user_chat(item));
                        navigation.navigate("ChatScreen", { item });
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
      <View style={styles.itemSection}>
        <View style={styles.upperSection}>
          <AppText style={styles.heading}>{language?.onAuction}</AppText>
          <TouchableOpacity onPress={() => navigation.navigate("Auction")}>
            <AppText style={styles.btnText}>{language?.showMore}</AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.lowerSection}>
          {!listData[3]?.length ? (
            <EmptyList description={language?.YouDontHhaveAanyActiveItem} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {listData[3]?.map((item, index) => {
                // console.log("auc--->", item)
                return (
                  <View style={{ marginRight: 10 }}>
                    <AuctionCard
                      ItemDetail={item}
                      backgroundColor={
                        index % 2 != 0 ? ["#B5654C", "#B5654C"] : false
                      }
                      onBidNow={() => {
                        dispatch(allActions.DetailAction.AuctionDetail(item));
                        // navigation.navigate("AuctionDetail", { item });
                        navigation.navigate("AuctionStack", {
                          screen: "AuctionDetail",
                        });
                      }}
                      onPressUser={() => {
                        Helper.fbEvent("open_profile_from_market");
                        // navigation.navigate("OtherUser", { user: item?.user });
                        dispatch(allActions.DetailAction.OtherUser(item?.user));
                        navigation.navigate("ProfileStack");
                      }}
                      onBuyNow={() => {
                        // navigation.navigate("ShipDetails", { item })
                        dispatch(allActions.DetailAction.AuctionDetail(item));
                        navigation.navigate("AuctionStack", {
                          screen: "AuctionDetail",
                        });
                      }}
                      onPressDetail={() => {
                        dispatch(allActions.DetailAction.AuctionDetail(item));
                        navigation.navigate("AuctionStack", {
                          screen: "AuctionDetail",
                        });
                      }}
                      onPressFlag={() => {
                        navigation.navigate("Flagging", {
                          id: item?.auctionable?.id,
                        });
                      }}
                      gotoChat={() => {
                        let name = item?.user?.full_name
                          ? item?.user?.full_name
                          : item?.user?.first_name;
                        // console.log('item', item);
                        item.type = item?.user?.id;
                        item.from = name;
                        item.message = item?.user?.image_url;
                        dispatch(allActions.SheetAction.user_chat(item));
                        navigation.navigate("ChatScreen", { item });
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
      <View style={styles.itemSection}>
        <View style={styles.upperSection}>
          <AppText style={styles.heading}>
            {language?.for + " " + language?.trade}
          </AppText>
          <TouchableOpacity onPress={() => navigation.navigate("Trade")}>
            <AppText style={styles.btnText}>{language?.showMore}</AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.lowerSection}>
          {!listData[4]?.length ? (
            <EmptyList description={language?.YouDontHhaveAanyActiveItem} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {listData[4]?.map((item, index) => {
                return (
                  <View
                    style={{
                      marginRight: 10,
                      marginLeft: index == 0 ? 1 : 0,
                      paddingBottom: 1,
                    }}
                  >
                    <TradeCard
                      ItemDetail={item}
                      onPressDetail={() => {
                        navigation.navigate("TradeStack", {
                          screen: "TradeDetail",
                          params: { from: "other" },
                        });
                        dispatch(allActions.DetailAction.TradeDetail(item));
                      }}
                      onPressFlag={() => {
                        Helper.fbEvent("create_flag_from_market");
                        navigation.navigate("Flagging", {
                          id: item?.tradeables[0]?.tradeable_id,
                        });
                      }}
                      onPressUser={() => {
                        Helper.fbEvent("open_profile_from_market");
                        // navigation.navigate("OtherUser", { user: item?.user });
                        dispatch(allActions.DetailAction.OtherUser(item?.user));
                        navigation.navigate("ProfileStack");
                      }}
                      onToggleFav={async () => {
                        const update = await toggleFav(
                          item?.id,
                          tradesList,
                          "Trade",
                          language
                        );
                        setTradesList(update);
                      }}
                      onToggleBookmark={async () => {
                        let update = await onTradeMark(
                          item?.id,
                          tradesList,
                          language
                        );
                        setTradesList(update);
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
          )}
        <View style={{marginBottom: 20}}/>
        </View>
      </View>
    </ScrollView>
  );
};
