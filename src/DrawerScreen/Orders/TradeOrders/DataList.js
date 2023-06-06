import React, { useContext, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import { OrdersCard, AppLoader } from "../../../../components";
import AppText from "../../../../components/AppText";
import colors from "../../../../constant/colors";
import moment from "moment";

import { useDispatch } from "react-redux";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import ThemeContext from "../../../Context/ThemeContext";

export const DataList = (props) => {
  const { dataList, navigation , ListFooterComponent, onEndReached} = props;
  const dispatch = useDispatch();
  const { theme }= useContext(ThemeContext);

  const getTradeOrder = async (item) => {
    console.log(item);
    navigation.navigate("TradeOrder", { item: item });
    // dispatch(allActions.DataAction.AppLoader(true));
    // const response = await MindAxios.get(
    //     Env.createUrl(`trades/${id}/order`)
    // );
    // dispatch(allActions.DataAction.AppLoader(false));
    // // console.log(response);
    // const { status } = response;
    // if (status == 200) {
    //     let _data = response?.data?.result?.item;
    //     dispatch(allActions.DetailAction.OrderDetail(_data))
    //     navigation.navigate("OrderDetail")
    // } else {
    //     alert("Something went wrong");
    // }
  };

  const renderItem = ({ item, index }) => {
    const date = moment(item?.created_at).fromNow();
    const isEnd = dataList?.length - 1 === index;
    return (
      <View style={{ marginBottom: isEnd ? hp(2.5) : 0 }}>
        <OrdersCard
          id={item?.id}
          date={date}
          shipTo={item?.receiver?.full_name}
          onPress={() => getTradeOrder(item)}
        />
      </View>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
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
    backgroundColor: colors.cWhite,
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
