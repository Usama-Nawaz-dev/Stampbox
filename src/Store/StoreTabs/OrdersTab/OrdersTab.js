import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator, View } from "react-native";

import { styles } from "./styles";
import HeaderTabs from "../../../../components/HeaderTabs";
import { OrdersList } from "../../../DrawerScreen/Orders/MyOrders/OrderList";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../../Helper";
import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import colors from "../../../../constant/colors";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";

const headers = ["All", "Processing", "Shipping", "Shipped", "Delivered"];

export const OrdersTab = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [orderList, setOrderList] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [shipped, setShipped] = useState(null);
  const [delivered, setDelivered] = useState(null);
  const [loading, setLoading] = useState(false);

  //Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (focused) {
      (async () => {
        await getOrders();
      })();
    }
  }, [focused]);

  const getOrders = async (value) => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(`store-orders`, `?store_id=${currentUser?.store?.id}`)
      //   Env.paramUrl(`store-orders`, ``)
    );
    setLoading(false);
    const { status } = response;
    if (status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      //   console.log(_data);
      const processingList = _data?.filter(
        (item) => item?.status === "Processing"
      );
      const shippingList = _data?.filter((item) => item?.status === "Shipping");
      const shippedList = _data?.filter((item) => item?.status === "Shipped");
      const deliveredList = _data?.filter(
        (item) => item?.status === "Delivered"
      );
      setOrderList(_data);
      setProcessing(processingList);
      setShipping(shippingList);
      setShipped(shippedList);
      setDelivered(deliveredList);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Something went wrong");
    }
  };

  const getNextOrders = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&store_id=${currentUser?.store?.id}`
      );
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
          color={theme?.theme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <HeaderTabs
        headers={headers}
        renderList={({ item, index }) => {
          switch (index) {
            case 0:
              return (
                <OrdersList
                  loader={loading}
                  dataList={orderList}
                  navigation={navigation}
                  onEndReached={getNextOrders}
                  ListFooterComponent={renderFooter}
                />
              );
            case 1:
              return (
                <OrdersList
                  loader={loading}
                  dataList={processing}
                  navigation={navigation}
                  onEndReached={getNextOrders}
                  ListFooterComponent={renderFooter}
                />
              );
            case 2:
              return (
                <OrdersList
                  loader={loading}
                  dataList={shipping}
                  navigation={navigation}
                  onEndReached={getNextOrders}
                  ListFooterComponent={renderFooter}
                />
              );
            case 3:
              return (
                <OrdersList
                  loader={loading}
                  dataList={shipped}
                  navigation={navigation}
                  onEndReached={getNextOrders}
                  ListFooterComponent={renderFooter}
                />
              );
            case 4:
              return (
                <OrdersList
                  loader={loading}
                  dataList={delivered}
                  navigation={navigation}
                  onEndReached={getNextOrders}
                  ListFooterComponent={renderFooter}
                />
              );
          }
        }}
      />
    </View>
  );
};
