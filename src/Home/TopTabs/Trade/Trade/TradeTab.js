import React, { useEffect, useState, memo, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";

import colors from "../../../../../constant/colors";

const { height, width } = Dimensions.get("window");

import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import Helper from "../../../../Helper";
import allActions from "../../../../../redux/actions";

import Btn from "../../../../../components/Btn";
import { useSelector, useDispatch } from "react-redux";

import AppText from "../../../../../components/AppText";
import BidCard from "../../../../../components/BidCard";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import ForTradeCard from "../../../../../components/ForTradeCard";
import EmptyState from "../../../../../components/EmptyState";

import Empty from "../../../../../components/Empty";
import { ProposalsCard } from "../../../../../components";
import { useFocusEffect } from "@react-navigation/native";

export const TradeTab = (props) => {
  const { type, navigation, tab } = props;
  const dispatch = useDispatch();

  const [tradeList, setTradeList] = useState(null);

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      const callApi = getData();
      return () => {
        // alert('Screen was unfocused');
        callApi;
      };
    }, [])
  );

  const getData = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.ActivityModal(true));
    const response = await MindAxios.get(
      Env.paramUrl(
        `${tab ? "trade-proposals" : "trades"}`,
        tab ? `?user_id=${userId}` : `?user_id=${userId}&type=${type}`
      )
    );
    console.log("res", response);
    dispatch(allActions.DataAction.ActivityModal(false));
    if (response?.status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      // if (tab) {
      //   console.log("_data", _data);
      // }
      setTradeList(_data);
      // dispatch(allActions.DataAction.ActivityModal(false));
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === tradeList.length - 1;
    // console.log("item ------>",item);
    return (
      <View
        style={{
          marginHorizontal: 10,
          marginBottom: isEnd ? hp(4) : null,
          marginTop: index !== 0 && index !== 1 ? hp(1.2) : null,
          //   paddingBottom: 1,
        }}
      >
        {tab ? (
          <ProposalsCard ItemDetail={item} {...props} />
        ) : (
          <ForTradeCard
            ItemDetail={item}
            type={type}
            onPressDetail={() => {
              console.log('item ==>', item)
              navigation.navigate("TradeDetail", { tradeData: item });
            }
            }
          />
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {tradeList?.length ? (
        <FlatList
          data={tradeList}
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Empty />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
    width: width,
    paddingTop: hp(2),
  },
  mainItem: {
    width: width,
    flex: 1,
    backgroundColor: colors.cWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightText,
  },
});
