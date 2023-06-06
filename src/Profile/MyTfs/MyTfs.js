import React, { useState, useEffect, useContext } from "react";
import { View, ActivityIndicator, FlatList } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import { MainHeader, MenuSheet } from "../../../components";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

import moment from "moment";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

export const MyTfs = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [dataList, setDataList] = useState(null);
  const [orderList, setOrderList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nextApiUrl, setNextApiUrl] = useState(null);

  const {
    myState: { language },
  } = useContext(AuthContext);

  const optionIcon = (
    <Entypo size={hp(2.7)} color={colors.cWhite} name="dots-three-vertical" />
  );

  useEffect(() => {
    if (focused) {
      getTfsOrders();
    }
  }, [focused]);

  const getTfsOrders = async (value) => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(`feedback?user_id=${userId}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log(response);
    if (response?.status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      setOrderList(_data);
      setDataList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Something went wrong");
    }
  };

  const getMoreTfsOrders = async (value) => {
    const userId = await Helper.getData("userId");
    if (nextApiUrl !== null && orderList?.length >= 10) {
      setIsLoading(true);
      const response = await MindAxios.get(nextApiUrl + `&user_id=${userId}`);
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setOrderList([...orderList, ..._data]);
        setDataList([...orderList, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setIsLoading(false);
        setNextApiUrl(null);
        alert("Sever Error..");
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  const renderItem = ({ item, index }) => {
    // console.log(item);
    let date = moment(item?.created_at).fromNow();

    let numbers = item?.feedback_ratings?.map((val) => parseInt(val?.rating));
    let sum = numbers.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const rating = (sum / numbers?.length).toFixed(1);

    return (
      <TfsCard
        date={date}
        id={item?.id}
        rating={rating}
        type={item?.feedbackable?.transactionable_type}
      />
    );
  };

  const sortData = (type) => {
    if (type) {
      const filterData = dataList?.filter(
        (item) => item?.feedbackable?.transactionable_type === type
      );
      setOrderList(filterData);
    } else {
      setOrderList(dataList);
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title={"My TFS Rating"}
        onPressBack={() => {
          props.navigation.goBack();
        }}
        rightIcon={
          <MenuSheet
            customButton={optionIcon}
            options={[
              language?.all,
              "Auction Orders",
              "Trade Orders",
              "Sale Orders",
              language?.cancel,
            ]}
            actions={[
              () => sortData(false),
              () => sortData("AuctionOrder"),
              () => sortData("TradeOrder"),
              () => sortData("SaleOrder"),
            ]}
          />
        }
      />
      {orderList?.length ? (
        <FlatList
          data={orderList}
          renderItem={renderItem}
          onEndReached={getMoreTfsOrders}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
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

const TfsCard = (props) => {
  const { id, type, date, rating } = props;

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      <View style={styles.itemSection}>
        <AppText style={styles.heading}>ID#</AppText>
        <AppText style={styles.value}>{id}</AppText>
      </View>

      <View style={styles.itemSection}>
        <AppText style={styles.heading}>{language.type}</AppText>
        <AppText style={styles.value}>{type}</AppText>
      </View>

      <View style={styles.itemSection}>
        <AppText style={styles.heading}>Score</AppText>
        <AppText style={styles.value}>{rating}</AppText>
      </View>

      <View style={styles.itemSection}>
        <AppText style={styles.heading}>{language?.date}</AppText>
        <AppText style={styles.value}>{date}</AppText>
      </View>
    </View>
  );
};
