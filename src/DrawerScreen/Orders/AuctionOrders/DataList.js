import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import { OrdersCard } from "../../../../components";
import AppText from "../../../../components/AppText";
import colors from "../../../../constant/colors";
import moment from "moment";

import { useDispatch } from "react-redux";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

export const DataList = (props) => {
  const dispatch = useDispatch();
  const { dataList, navigation, ListFooterComponent, onEndReached } = props;

  const getAuctionOrder = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl(`auction-orders`, id));
    // console.log(response);
    dispatch(allActions.DataAction.AppLoader(false));
    const { status } = response;
    if (status == 200) {
      let _data = response?.data?.result?.item;
      dispatch(allActions.DetailAction.OrderDetail(_data));
      navigation.navigate("OrderDetail");
    } else {
      alert("Something went wrong");
    }
  };

  const renderItem = ({ item, index }) => {
    let date = moment(item?.created_at).fromNow();
    return (
      <OrdersCard
        id={item?.id}
        date={date}
        amount={item?.subtotal}
        shipping={item?.shipment?.amount}
        onPress={() => getAuctionOrder(item?.id)}
      />
    );
  };
  return (
    <View style={styles.container}>
      {dataList?.length ? (
        <FlatList
          data={dataList}
          renderItem={renderItem}
          ListFooterComponent={ListFooterComponent}
          onEndReached={onEndReached}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={styles.itemText}>
            You have no Item listed at this time
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.cWhite,
  },
  mainItem: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    // color: colors.lightText,
  },
});
