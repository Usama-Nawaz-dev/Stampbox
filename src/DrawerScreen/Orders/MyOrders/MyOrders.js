import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { styles } from "./styles";

import { NewList } from "./NewList";
import { MainHeader } from "../../../../components";
import HeaderTabs from "../../../../components/HeaderTabs";

import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../../Helper";
import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import colors from "../../../../constant/colors";

const headers = ["All", "Processing", "Shipping", "Shipped", "Delivered"];

export const MyOrders = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [orderList, setOrderList] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [shipped, setShipped] = useState(null);
  const [delivered, setDelivered] = useState(null);
  const [loading, setLoading] = useState(false);
  //Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (focused) {
      (async () => {
        await getOrders();
      })();
    }
  }, [focused]);

  const getOrders = async (value) => {
    // console.log("type", type)
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`sale-orders`, `?user_id=${userId}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    const { status } = response;
    // console.log(response);
    if (status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      // console.log(_data)
      const processingList = _data?.filter(
        (item) => item?.store_orders[0]?.status === "Processing"
      );
      const shippingList = _data?.filter(
        (item) => item?.store_orders[0]?.status === "Shipping"
      );
      const shippedList = _data?.filter(
        (item) => item?.store_orders[0]?.status === "Shipped"
      );
      const deliveredList = _data?.filter(
        (item) => item?.store_orders[0]?.status === "Delivered"
      );
      setOrderList(_data);
      setProcessing(processingList);
      setShipping(shippingList);
      setShipped(shippedList);
      setDelivered(deliveredList);
    } else {
      alert("Something went wrong");
    }
  };

  const getNextOrders = async () => {
    const userId = await Helper.getData("userId");
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(nextApiUrl + `&user_id=${userId}`);
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        const processingList = _data?.filter(
          (item) => item?.status === "Processing"
        );
        const shippingList = _data?.filter(
          (item) => item?.status === "Shipping"
        );
        const shippedList = _data?.filter((item) => item?.status === "Shipped");
        const deliveredList = _data?.filter(
          (item) => item?.status === "Delivered"
        );
        setOrderList([...orderList, ..._data]);
        setProcessing([...processing, ...processingList]);
        setShipping([...shipping, ...shippingList]);
        setShipped([...shipped, ...shippedList]);
        setDelivered([...delivered, ...deliveredList]);
        setNextApiUrl(nextPageUrl);
      } else {
        setIsLoading(false);
        setNextApiUrl(null);
        alert("Sever Error.");
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          // animation={loder}
          size={"large"}
          color={colors.lightTheme}
          style={{ marginBottom: 20, top: 10 }}
        />
      </View>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="My Order"
        onPressBack={() =>
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        }
      />
      <HeaderTabs
        headers={headers}
        renderList={({ item, index }) => {
          switch (index) {
            case 0:
              return (
                <NewList
                  dataList={orderList}
                  onEndReached={getNextOrders}
                  ListFooterComponent={renderFooter}
                  navigation={navigation}
                  goto={index}
                />
              );
            case 1:
              return (
                <NewList
                  dataList={processing}
                  onEndReached={getNextOrders}
                  ListFooterComponent={renderFooter}
                  navigation={navigation}
                />
              );
            case 2:
              return (
                <NewList
                  dataList={shipping}
                  onEndReached={getNextOrders}
                  ListFooterComponent={renderFooter}
                  navigation={navigation}
                />
              );
            case 3:
              return (
                <NewList
                  dataList={shipped}
                  onEndReached={getNextOrders}
                  ListFooterComponent={renderFooter}
                  navigation={navigation}
                />
              );
            case 4:
              return (
                <NewList
                  dataList={delivered}
                  onEndReached={getNextOrders}
                  ListFooterComponent={renderFooter}
                  navigation={navigation}
                />
              );
          }
        }}
      />
    </View>
  );
};
