import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import colors from "../../../../constant/colors";
import { DataList } from "./DataList";
import { CustomButton } from "../../../../components";

import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ThemeContext from "../../../Context/ThemeContext";

export const IncomingTab = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [isProcessing, setIsProcessing] = useState(true);
  const [isShipping, setIsShipping] = useState(false);
  const [isShipped, setIsShipped] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);

  const [dataList, setDataList] = useState(null);

  //Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  let status;
  if (isProcessing) {
    status = "Processing";
  } else if (isShipping) {
    status = "Shipping";
  } else if (isShipped) {
    status = "Shipped";
  } else if (isDelivered) {
    status = "Delivered";
  }

  useEffect(() => {
    if (focused) {
      (async () => {
        await getOrders(status);
      })();
    }
  }, [focused]);

  const getOrders = async (value) => {
    // console.log("type", type)
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`trade-orders`, `?receiver_id=${userId}&status=${value}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    const { status } = response;
    if (status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      // console.log(nextPageUrl);
      setDataList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Something went wrong");
    }
  };

  const getNextOrders = async (value) => {
    console.log(value);
    const userId = await Helper.getData("userId");
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&receiver_id=${userId}&status=${value}`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setDataList([...dataList, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        setIsLoading(false);
        alert("Sever Error..");
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
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <View style={styles.btnSection}>
        <CustomButton
          bg={!isProcessing ? colors.background : colors.color8}
          label="Processing"
          textColor={!isProcessing && colors.placeholderText}
          width={wp(22)}
          height={30}
          fontSize={12}
          onPress={() => {
            setIsProcessing(true);
            setIsShipping(false);
            setIsShipped(false);
            setIsDelivered(false);
            getOrders("Processing");
          }}
        />
        <CustomButton
          bg={!isShipping ? colors.background : colors.color8}
          label="Shipping"
          textColor={!isShipping && colors.placeholderText}
          width={wp(22)}
          height={30}
          fontSize={12}
          onPress={() => {
            setIsProcessing(false);
            setIsShipping(true);
            setIsShipped(false);
            setIsDelivered(false);
            getOrders("Shipping");
          }}
        />
        <CustomButton
          bg={!isShipped ? colors.background : colors.color8}
          label="Shipped"
          textColor={!isShipped && colors.placeholderText}
          width={wp(22)}
          height={30}
          fontSize={12}
          onPress={() => {
            setIsProcessing(false);
            setIsShipping(false);
            setIsShipped(true);
            setIsDelivered(false);
            getOrders("Shipped");
          }}
        />
        <CustomButton
          bg={!isDelivered ? colors.background : colors.color8}
          label="Delivered"
          textColor={!isDelivered && colors.placeholderText}
          width={wp(22)}
          height={30}
          fontSize={12}
          onPress={() => {
            setIsProcessing(false);
            setIsShipping(false);
            setIsShipped(false);
            setIsDelivered(true);
            getOrders("Delivered");
          }}
        />
      </View>
      <DataList
        dataList={dataList}
        ListFooterComponent={renderFooter}
        onEndReached={() => getNextOrders(status)}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  btnSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
    marginTop: hp(2),
  },
});
