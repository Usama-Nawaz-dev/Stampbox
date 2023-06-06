import React, { useContext, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";

import { MainTab } from "./MainTab";
import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import { images } from "../../assets/images/Images";
import { WalletSheet } from "./WalletSheet";
import { RangeSheet } from "./RengeSheet";

import {
  EmptyList,
  MenuSheet,
  MainHeader,
  WalletCard,
  HistoryCard,
  BottomSheet,
} from "../../components";

import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import ThemeContext from "../Context/ThemeContext";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";

import Helper from "../Helper";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import allActions from "../../redux/actions";

const Wallet = (props) => {
  const { navigation } = props;
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const walletSheetRef = useRef();
  const calendarSheetRef = useRef();
  const { theme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(false);
  const [isCoins, setISCoins] = useState(true);
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [histroyList, setHistoryList] = useState(null);
  const [currentList, setCurrentList] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);

  const [filterValues, setFilterValue] = useState(null);
  const initialVal = { status: "" };

  const user = useSelector((state) => state.ApiReducer.user);
  if (user) {
    var { coins, wallet_balance, first_name, last_name, username } = user;
  }

  useEffect(() => {
    if (focused) {
      setISCoins(true);
      fetchHistroy(true);
      setFilterValue(initialVal);
    }
  }, [focused]);

  const fetchHistroy = async (type) => {
    const paramUrl = type
      ? `coins?user_id=${user?.id}`
      : `payment/wallet-payment-logs?user_id=${user?.id}`;
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.createUrl(paramUrl));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      setHistoryList(_data);
      setCurrentList(_data);
      setNextApiUrl(nextPageUrl);
    }
  };

  const loadMoreHistory = async () => {
    if (nextApiUrl !== null && histroyList?.length >= 10) {
      setLoading(true);
      const response = await MindAxios.get(nextApiUrl + `&user_id=${user?.id}`);
      setLoading(false);
      if (response.status === 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setHistoryList([...histroyList, ..._data]);
        setCurrentList([...histroyList, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        Helper.showToastMessage(
          "There's some issue while fetching Suggestions",
          colors.danger
        );
      }
    }
  };

  const renderFooter = () => {
    return loading ? (
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

  const renderItem = ({ item, index }) => {
    let isEnd = index == histroyList.length - 1 ? hp(5) : null;
    let createdAt = moment(item?.created_at).format("YYYY-MM-DD [at] h:mmA");
    return (
      <>
        {isCoins ? (
          <HistoryCard
            labels={{
              title: item?.status,
              lower: item?.description,
              val: item?.coins,
              sign: item?.status == "credit" ? "+" : "^",
              time: createdAt,
            }}
            icon={
              <Image
                source={images.Trade}
                style={{
                  height: hp(2.5),
                  width: hp(2.5),
                  tintColor: colors.cWhite,
                }}
              />
            }
            style={{ marginBottom: isEnd }}
          />
        ) : (
          <HistoryCard
            labels={{
              title: item?.type,
              lower: item?.description,
              val: item?.amount,
              sign: item?.type == "credit" ? "+" : "^",
              time: createdAt,
            }}
            icon={
              <Image
                source={images.Trade}
                style={{
                  height: hp(2.5),
                  width: hp(2.5),
                  tintColor: colors.cWhite,
                }}
              />
            }
            style={{ marginBottom: isEnd }}
          />
        )}
      </>
    );
  };

  const optionIcon = (
    <View style={styles.rowSection}>
      <AppText style={styles.viewByText}>View By</AppText>
      <Ionicons
        size={hp(2)}
        color={theme.davyGrey}
        name="ios-caret-down-outline"
      />
    </View>
  );

  const onApplyFilter = async () => {
    let query = "";
    let newValues = Helper.deepCopy(filterValues);
    if (!isCoins) {
      newValues.type = filterValues?.status;
      delete newValues?.status;
    }
    if (newValues !== null) {
      query = Object.keys(newValues)
        .map((k) => {
          if (Array.isArray(newValues[k])) {
            return newValues[k].map((val) => `${k}=${val}`).join("&");
          }
          return `${k}=${newValues[k]}`;
        })
        .join("&");
    }

    const paramUrl = isCoins
      ? `coins?user_id=${user?.id}&${query}&page_size=9`
      : `payment/wallet-payment-logs?user_id=${user?.id}&${query}&page_size=9`;

    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.createUrl(paramUrl));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setHistoryList(_data);
    } else {
      alert("Server Error");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      <MainHeader
        title="Wallet"
        onPressBack={() => props.navigation.goBack()}
      />
      <AppText style={[styles.text, { marginTop: hp(1.5) }]}>
        Hello, {`${first_name} ${last_name ? last_name : ""}`}
      </AppText>
      <AppText style={{ marginLeft: wp(3) }}>Have a nice day!</AppText>
      <View style={styles.cardSection}>
        <WalletCard
          label="Available Coins"
          time="Updated just now"
          val={coins}
          btnLabel="Buy Trade Coins"
          icon={images.coin_stack}
          iconSize={hp(5)}
          onPress={() => navigation.navigate("CoinsWallet")}
        />
        <WalletCard
          label="Available Credit"
          time="Updated just now"
          val={`$${wallet_balance}`}
          btnLabel="Manage Payment"
          icon={images.sack_dollar}
          iconSize={hp(5)}
          onPress={() => navigation.navigate("Wallet")}
        />
      </View>
      <View style={styles.menuSection}>
        <AppText style={styles.text}>
          {isCoins ? "Coin" : "Wallet"} Statement
        </AppText>

        <MenuSheet
          destructiveIndex={4}
          customButton={optionIcon}
          options={["Coins", "Payments", "More", "Cancel"]}
          actions={[
            () => {
              setISCoins(true);
              fetchHistroy(true);
            },
            () => {
              setISCoins(false);
              fetchHistroy(false);
            },
            () => walletSheetRef?.current?.open(),
          ]}
        />
      </View>
      {histroyList?.length ? (
        <FlatList
          data={histroyList}
          renderItem={renderItem}
          onEndReached={loadMoreHistory}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.itemView}>
          <EmptyList description={"No Transaction Found."} />
        </View>
      )}

      {/* Filter Sheet */}
      <BottomSheet
        ref={walletSheetRef}
        sheetHeight={hp(45)}
        ChildComponent={
          <WalletSheet
            filterValues={filterValues}
            selectedRange={selectedRange}
            setFilterValue={setFilterValue}
            onPressItem={(val) => {
              walletSheetRef?.current?.close();
              setTimeout(() => {
                calendarSheetRef?.current?.open();
              }, 350);
            }}
            onApplyFilter={() => {
              walletSheetRef?.current?.close();
              onApplyFilter();
            }}
            onReset={() => {
              walletSheetRef?.current?.close();
              setHistoryList(currentList);
              setFilterValue(initialVal);
              setSelectedRange(null);
            }}
          />
        }
      />

      <BottomSheet
        ref={calendarSheetRef}
        dropDown={false}
        borderRadius={10}
        sheetHeight={hp(55)}
        ChildComponent={
          <RangeSheet
            dateType={"MutliDay"}
            filterValues={filterValues}
            setFilterValue={setFilterValue}
            setSelectedRange={setSelectedRange}
            onCancel={() => {
              calendarSheetRef?.current?.close();
              setTimeout(() => {
                walletSheetRef?.current?.open();
              }, 350);
            }}
            onSelectDate={(date) => {
              calendarSheetRef?.current?.close();
              setTimeout(() => {
                walletSheetRef?.current?.open();
              }, 350);
            }}
          />
        }
      />
    </View>
  );
};

export { Wallet };

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    marginLeft: wp(3),
    fontWeight: "bold",
  },
  cardSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    marginBottom: hp(0.5),
    marginTop: hp(1),
  },
  menuSection: {
    marginVertical: hp(0.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: wp(3),
  },
  viewByText: {
    fontSize: 12,
    paddingRight: wp(2),
  },
  itemView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
