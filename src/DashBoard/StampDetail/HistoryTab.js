import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView, FlatList } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";

import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

export const HistoryTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const stampDetail = useSelector((state) => state.DetailReducer.stampDetail);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const [itemInfo, setItemInfo] = useState(null);
  const { theme }= useContext(ThemeContext);

  useEffect(() => {
    if (focused) {
      fetchHistory();
    }
  }, [focused]);

  const fetchHistory = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(
        "symlinks/stamp-item",
        `?id=${stampDetail?.id}&symlink_model=All`
      )
    );
    if (response?.status === 200) {
      const _data = response?.data?.result?.symlinks?.data;
      setItemInfo(_data[0]);
    } else {
      alert(language?.serverError);
    }
  };
  return (
    <View style={[styles.mainContainer, { backgroundColor: theme?.white}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <AppText style={styles.infoText}>
          Attached as Trade: {stampDetail?.is_attached_in_trades}
        </AppText>
        {itemInfo?.tradeables?.length ? (
          <InfoCard data={itemInfo?.tradeables} type="Trade" />
        ) : null}
        <AppText style={styles.infoText}>
          Attached as Actions: {stampDetail?.is_attached_in_auctions}
        </AppText>
        {itemInfo?.auctions?.length ? (
          <InfoCard data={itemInfo?.auctions} type="Auction" />
        ) : null}
        <AppText style={styles.infoText}>
          Attached as Products: {stampDetail?.is_attached_in_supply}
        </AppText>
        {itemInfo?.products?.length ? (
          <InfoCard data={itemInfo?.products} type="Product" />
        ) : null}
        <AppText style={styles.infoText}>
          Sent as Offer: {stampDetail?.is_item_placed_in_trade_offer}
        </AppText>
        {itemInfo?.trade_offers?.length ? (
          <InfoCard data={itemInfo?.trade_offers} type="Trade Offer" />
        ) : null}
        <View style={styles.propSection}>
          <AppText style={styles.infoText}>Proposal Id: 00</AppText>
          <AppText style={styles.infoText}>Is Expired: True</AppText>
        </View>
      </ScrollView>
    </View>
  );
};

export const InfoCard = ({ data, type }) => {
  const { theme }= useContext(ThemeContext);
  const renderList = ({ item, index }) => {
    let created_at;
    let amountKey;
    let statusKey;
    let amount;
    let status;

    if (type === "Trade") {
      created_at = moment(item?.trade?.created_at).format(
        "YYYY-MM-DD [at] h:mm A"
      );
      amount = item?.trade?.offer_amount ? item?.trade?.offer_amount : 0;
      status = item?.trade?.status;
      amountKey = "Amount";
      statusKey = "Status";
    } else if (type === "Auction") {
      created_at = moment(item?.created_at).format("YYYY-MM-DD [at] h:mm A");
      amount = item?.initial_bid ? item?.initial_bid : 0;
      amountKey = "Initial Bid";
      statusKey = "Status";
      status = item?.status;
    } else if (type === "Product") {
      created_at = moment(item?.created_at).format("YYYY-MM-DD [at] h:mm A");
      status = item?.sale_price ? item?.sale_price : 0;
      amount = item?.quantity ? item?.quantity : 0;
      amountKey = "In Stock";
      statusKey = "Price";
    } else {
      created_at = moment(item?.created_at).format("YYYY-MM-DD [at] h:mm A");
      amount = item?.is_expired ? "True" : "False";
      amountKey = "Is Expired";
      status = item?.status;
      statusKey = "Status";
    }
    return (
      <View style={styles.listItem}>
        <AppText style={styles.itemText}>
          Stamp used as {type} at {created_at}
        </AppText>
        <View style={styles.bottomSection}>
          <AppText style={styles.itemText1}>
            {statusKey}: <AppText style={styles.valText}>{status}</AppText>
          </AppText>
          <AppText style={styles.itemText1}>
            {amountKey}: <AppText style={styles.valText}>{amount}</AppText>
          </AppText>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor}]}>
      <FlatList data={data} renderItem={renderList} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  container: {
    paddingTop: hp(1),
    alignItems: "center",
  },
  propSection: {
    width: wp(80),
    marginBottom: hp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoText: {
    fontWeight: "500",
    paddingTop: hp(1),
    // color: colors.lightText,
  },

  //info Card
  card: {
    backgroundColor: "#fff",
    width: wp(94),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 0.84,
    borderRadius: 5,
    marginTop: hp(1),
    padding: wp(2),
    paddingBottom: 0,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(0.5),
  },
  itemText: {
    fontSize: 12,
    // color: colors.lightBlack,
  },
  itemText1: {
    fontSize: 12,
    fontWeight: "500",
    // color: colors.lightBlack,
  },
  valText: {
    fontWeight: "400",
    // color: colors.lightText,
  },
  listItem: {
    paddingBottom: wp(2),
  },
});
