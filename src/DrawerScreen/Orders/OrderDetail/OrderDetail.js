import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, ScrollView } from "react-native";

import { styles } from "./styles";
import {
  MainHeader,
  OrderDetailCard,
  AuctionOrderCard,
  TradeOrderCard,
  FeedbackCard,
} from "../../../../components";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

import allActions from "../../../../redux/actions";
import ThemeContext from "../../../Context/ThemeContext";

export const OrderDetail = (props) => {
  const order = useSelector((state) => state.DetailReducer.orderDetail);
  const [orderDetail, setOrderDetail] = useState(null);
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const { theme }= useContext(ThemeContext);

  useEffect(() => {
    setOrderDetail(order);
  }, [focused]);

  const renderItem = ({ item, index }) => {
    console.log("this is item-->", item);
    const isEnd = orderDetail?.store_orders?.length - 1;
    return (
      <View style={{ marginBottom: index === isEnd ? hp(3) : 0 }}>
        <OrderDetailCard
          orderDetail={orderDetail}
          storeItem={item}
          index={index}
        />
      </View>
    );
  };
  const statusChecker = () => {
    if (orderDetail?.order_meta?.id) {
      const storeOrder = orderDetail?.store_orders?.length ? orderDetail?.store_orders[0]?.status : null
      if (storeOrder == "Delivered" || orderDetail?.status == "Delivered") {
        return (
          <FeedbackCard
            id={orderDetail?.order_meta?.id}
            tradeId={orderDetail?.id}
            showBtn={orderDetail?.transaction?.is_rated ? false : true}
            time={orderDetail?.order_meta?.created_at}
            onPress={() =>
              props.navigation.navigate("Feedback", { type: "Buyer" })
            }
          />
        );
      } else {
        return null;
      }
    } else {
      return (
        <FeedbackCard
          title="Trade"
          showBtn={false}
          id={orderDetail?.id}
          time={orderDetail?.created_at}
          onPress={() => alert("Feedback Pressed")}
        />
      );
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title="Order Details"
        onPressBack={() => {
          // dispatch(allActions.DetailAction.OrderDetail([]));
          props.navigation.goBack();
        }}
      />
      {statusChecker()}
      {orderDetail?.store_orders?.length ? (
        <FlatList
          style={{ marginTop: hp(1) }}
          data={orderDetail?.store_orders}
          renderItem={renderItem}
          showsVerticalScrollIndicator={true}
        />
      ) : (
        <ScrollView style={{ marginTop: hp(0.5) }}>
          {orderDetail?.auction ? (
            <AuctionOrderCard
              orderDetail={orderDetail}
              auction={orderDetail?.auction?.auctionable}
            />
          ) : (
            <TradeOrderCard
              orderDetail={orderDetail}
              trade={orderDetail?.tradeables[0]?.tradeable}
              trade_order={orderDetail?.trade_orders[0]}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
};
