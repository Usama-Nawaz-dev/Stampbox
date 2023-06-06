import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

export const ReportTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const user = useSelector((state) => state.ApiReducer.user);
  const [reportCount, setReportCount] = useState(null);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (focused) {
      fetchReports();
    }
  }, [focused]);

  const fetchReports = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const res = await MindAxios.get(Env.createUrl("inventory/user/reports"));
    dispatch(allActions.DataAction.AppLoader(false));
    if (res?.status == 200) {
      const _data = res?.data?.result?.counts;
      setReportCount(_data);
    } else {
      Helper.showToastMessage(language?.serverError, colors.danger);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardSection}>
          <BreakDownCard
            heading={"Coins Credits/month"}
            data={reportCount?.credit_coin}
          />
          <BreakDownCard
            heading={"Coins Debits/month"}
            data={reportCount?.debit_coin}
          />
        </View>
        <View style={styles.cardSection}>
          <BreakDownCard
            heading={"Cash Credits/month"}
            data={reportCount?.credit_cash}
          />
          <BreakDownCard
            heading={"Cash Debits/month"}
            data={reportCount?.debit_cash}
          />
        </View>

        <View style={styles.cardSection}>
          <BreakDownCard
            data={reportCount?.item_auction}
            heading={"Total Items Sold via Auction/month"}
          />
          <BreakDownCard
            heading={"Total Items Traded/month"}
            data={reportCount?.total_trade_per_month}
          />
        </View>

        <View style={styles.cardSection}>
          <BreakDownCard
            heading={"Total Items on Bounty/month"}
            data={reportCount?.total_bounty_per_month}
          />
          <BreakDownCard
            data={reportCount?.item_sold}
            heading={"Total Items Sold/month"}
          />
        </View>
        <View style={[styles.cardSection, { marginBottom: hp(2.5) }]}>
          <BreakDownCard
            heading={"Total Items Purchased"}
            data={reportCount?.item_purchase}
          />
          <BreakDownCard
            heading={"Total Trades"}
            data={reportCount?.total_trade}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const BreakDownCard = (props) => {
  const { theme } = useContext(ThemeContext);

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", { month: "long" });
  };

  return (
    <View style={[styles.mulCard, { backgroundColor: theme?.cardColor }]}>
      <View style={styles.cardHeader}>
        <AppText style={styles.headerText}>{props?.heading}</AppText>
      </View>
      {props?.data?.length ? (
        <ScrollView>
          {props?.data?.map((item, index) => {
            if (item?.total_user_coin >= 0) {
              return (
                <ItemComponent
                  name={getMonthName(item?.month)}
                  value={`€ ${item?.total_user_coin}`}
                />
              );
            } else if (item?.total_cash_per_month >= 0) {
              return (
                <ItemComponent
                  name={getMonthName(item?.month)}
                  value={`$ ${item?.total_cash_per_month}`}
                />
              );
            } else if (item?.total_item_sold >= 0) {
              return (
                <ItemComponent
                  name={getMonthName(item?.month)}
                  value={`${item?.total_item_sold}`}
                />
              );
            } else if (item?.total_trade_per_month >= 0) {
              return (
                <ItemComponent
                  name={getMonthName(item?.month)}
                  value={`${item?.total_trade_per_month}`}
                />
              );
            } else if (item?.total_item_purchase >= 0) {
              return (
                <ItemComponent
                  name={getMonthName(item?.month)}
                  value={`${item?.total_item_purchase}`}
                />
              );
            } else if (item?.total_auction >= 0) {
              return (
                <ItemComponent
                  name={getMonthName(item?.month)}
                  value={`${item?.total_auction}`}
                />
              );
            } else if (item?.total_bounty_per_month >= 0) {
              return (
                <ItemComponent
                  name={getMonthName(item?.month)}
                  value={`${item?.total_bounty_per_month}`}
                />
              );
            } else if (item?.total_trade >= 0) {
              return (
                <ItemComponent
                  name={getMonthName(item?.month)}
                  value={`${item?.total_trade}`}
                />
              );
            }
          })}
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <AppText style={{ fontSize: 12, fontWeight: "500" }}>
            No data found.
          </AppText>
        </View>
      )}
    </View>
  );
};

const ItemComponent = (props) => {
  return (
    <View style={styles.constionComp}>
      <AppText style={styles.valueText1}>{props?.name}</AppText>
      <AppText style={styles.valueText1}>{props?.value}</AppText>
    </View>
  );
};
