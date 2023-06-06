import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import { NotifyComp } from "./NotifyComp";
import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import OnlyDropDown from "../../components/OnlyDropDown";
import { AppHeader, CustomButton } from "../../components";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";

import Helper from "../Helper";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import allActions from "../../redux/actions";

import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";
import { images } from "../../assets/images/Images";

const sort_by = [
  { label: "All", value: "All" },
  { label: "Trade", value: "Trade" },
  { label: "Admin", value: "Admin" },
  { label: "Store", value: "Store" },
  { label: "Auction", value: "Auction" },
  { label: "Payment", value: "Payment" },
  { label: "Bounty", value: "Bounty" },
  { label: "Club", value: "Club" },
  { label: "Coin", value: "Coin" },
  { label: "Event", value: "Event" },
  { label: "Feedback", value: "Feedback" },
  { label: "Flag", value: "Flag" },
  { label: "Offer Product", value: "Offer-Product" },
  { label: "Suggestion", value: "Suggestion" },
  { label: "User", value: "User" },
];

export const Notify = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const cartProducts = useSelector((state) => state.DataReducer.cart);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifyList, setNotifyList] = useState(null);
  const [sort_value, setSortValue] = useState("All");
  const [nextPageUrl, setNextPageUrl] = useState(null);

  useEffect(() => {
    if (focused) {
      fetchNotifications();
    } else {
      setSortValue("All");
    }
  }, [focused]);

  const onRefresh = async () => {
    setIsLoading(true);
    await fetchNotifications();
    setIsLoading(false);
  };

  const fetchNotifications = async (value) => {
    setLoading(true);
    const url = value
      ? `notifications?page_size=20&type=${value}`
      : `notifications?page_size=20`;
    const response = await MindAxios.get(Env.createUrl(url));

    setLoading(false);
    // console.log("res-->", response);
    if (response?.status == 200) {
      const _data = response?.data?.result?.notifications?.data;
      const nextPage = response?.data?.result?.notifications?.next_page_url;
      console.log(nextPage);
      setNextPageUrl(nextPage);
      setNotifyList(_data);
    } else {
      alert(language?.serverError);
    }
  };

  const fetchMoreNotifications = async () => {
    if (nextPageUrl !== null && notifyList?.length >= 10) {
      setLoading(true);
      const url =
        sort_value === "All"
          ? `&page_size=20`
          : `&page_size=20&type=${sort_value.replace(" ", "-")}`;
      const response = await MindAxios.get(nextPageUrl + url);
      setLoading(false);
      const error = response?.response?.data;
      if (response?.status == 200) {
        const _data = response?.data?.result?.notifications?.data;
        const nextPage = response?.data?.result?.notifications?.next_page_url;
        setNextPageUrl(nextPage);
        setNotifyList([...notifyList, ..._data]);
      } else {
        alert("Error", `${error?.message}`);
      }
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.loader}>
        {loading && <ActivityIndicator size="large" color={theme?.theme} />}
      </View>
    );
  };

  const markAllRead = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl("notifications/mark-all-as-read")
    );
    // console.log("res-->", response);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      fetchNotifications();
      Helper.showToastMessage("Notification updated successfully.", "green");
    } else {
      alert(language?.serverError);
    }
  };

  const deleteAll = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl("notifications/delete-all-notifications")
    );
    // console.log("res-->", response);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      fetchNotifications();
      Helper.showToastMessage("Notification deleted successfully.", "green");
    } else {
      alert(language?.serverError);
    }
  };

  const markAsRead = async (id) => {
    // dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(
      Env.createUrl("notifications/mark-single-as-read"),
      {
        id: id,
      }
    );
    // console.log("res-->", response);
    // dispatch(allActions.DataAction.AppLoader(false));
    // if (response?.status == 200) {
    //   fetchNotifications();
    //   Helper.showToastMessage("Notification updated successfully.", "green");
    // } else {
    //   alert("Server Error.");
    // }
  };

  const typeChecker = (item) => {
    // console.log("item", item);
    markAsRead(item?.id);
    if (item?.data?.property?.bounty) {
      const bounty = item?.data?.property?.bounty;
      dispatch(allActions.DetailAction.BountyDetail(bounty));
      navigation.navigate("BountyStack");
    } else if (
      item?.data?.type == "COIN_DEPOSIT" ||
      item?.data?.type == "COIN_WITHDRAW" ||
      item?.data?.type == "PAYMENT_DEPOSIT"
    ) {
      navigation.navigate("MainWallet");
    } else if (item?.data?.type == "FOLLOW_USER") {
      dispatch(allActions.SheetAction.initialRoute("MyNetwork"));
      navigation.reset({
        index: 0,
        routes: [{ name: "GeneralStack" }],
      });
    } else if (item?.data?.property?.event) {
      const event = item?.data?.property?.event;
      dispatch(allActions.SheetAction.initialRoute("EventDetail"));
      dispatch(allActions.SheetAction.EventType(event?.type));
      dispatch(allActions.DetailAction.EventDetail(event));
      navigation.reset({
        index: 0,
        routes: [{ name: "GeneralStack" }],
      });
    } else if (item?.data?.property?.trade) {
      const tradeItem = item?.data?.property?.trade;
      fetchTrade(tradeItem?.id);
    } else if (item?.data?.property?.suggestable) {
      const currentItem = item?.data?.property?.suggestable;
      fetchStamp(currentItem?.id);
    } else if (item?.data?.property?.sale_order) {
      const saleOrder = item?.data?.property?.sale_order;
      getSaleOrder(saleOrder?.id);
    } else if (item?.data?.type === "SALE_ORDER_CONFIRMATION") {
      const orderId = item?.data?.property?.id;
      getSaleOrder(orderId);
    }
  };

  const fetchTrade = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.createUrl(`trades/${id}`));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.item;
      dispatch(allActions.DetailAction.TradeDetail(_data));
      navigation.navigate("TradeStack", {
        screen: "TradeDetail",
      });
    } else {
      alert(language?.serverError);
    }
    m;
  };

  const fetchStamp = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.createUrl(`stamp-items/${id}`));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.stamp_item;
      dispatch(allActions.SheetAction.initialRoute("StampDetail"));
      dispatch(allActions.DetailAction.StampDetail(_data));
      navigation.reset({
        index: 0,
        routes: [{ name: "GeneralStack" }],
      });
    } else {
      alert(language?.serverError);
    }
  };

  const getSaleOrder = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl(`sale-orders`, id));
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
    // console.log('item', item);
    return (
      <NotifyComp
        item={item}
        onDelete={async () => {
          const body = { id: item?.id };
          const response = await MindAxios.post(
            Env.createUrl("notifications/delete-notification"),
            body
          );
          if (response?.status === 200) {
            const filterData = notifyList.filter((val) => val?.id !== item?.id);
            setNotifyList(filterData);
          }
        }}
        onPress={() => typeChecker(item)}
      />
    );
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: theme?.white }]}>
      <AppHeader
        title="Notifications"
        cartLength={cartProducts?.length}
        coins={currentUser?.coins}
        onPressMenu={() => navigation.openDrawer()}
        onPressCart={() => navigation.navigate("MyCart")}
        onPressWallet={() => navigation.navigate("MainWallet")}
      />

      <View style={styles.upperSection}>
        <View style={styles.btnSection}>
          {notifyList?.length ? (
            <>
              <CustomButton
                bg={colors.background}
                label="Delete All"
                textColor={colors.red}
                width={80}
                height={27}
                fontSize={12}
                style={{ marginRight: 10 }}
                onPress={deleteAll}
              />
              <CustomButton
                bg={colors.background}
                label="Read All"
                textColor={colors.btnText}
                width={80}
                height={27}
                fontSize={12}
                onPress={markAllRead}
              />
            </>
          ) : null}
        </View>
        <View style={styles.rightSection}>
          <AppText style={styles.sortText}>{sort_value}</AppText>
          <OnlyDropDown
            data={sort_by}
            value={sort_value}
            onChangeText={(value) => {
              const val = value.replace("-", " ");
              setSortValue(val);
              fetchNotifications(value);
            }}
            position={-5}
            width="40%"
            left={wp(14)}
            iconRight={0}
            height={hp(30)}
            icon={() => (
              <Image source={images.Option} style={styles.optionIcon} />
            )}
          />
        </View>
      </View>

      {notifyList?.length ? (
        <FlatList
          data={notifyList}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={isLoading}
              tintColor={colors.lightTheme}
            />
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          onEndReached={fetchMoreNotifications}
        />
      ) : (
        <View style={styles.emptySection}>
          {loading ? (
            renderFooter()
          ) : (
            <AppText style={[styles.emptyText, { color: theme?.theme }]}>
              You don't have any notifications.
            </AppText>
          )}
        </View>
      )}
    </View>
  );
};
