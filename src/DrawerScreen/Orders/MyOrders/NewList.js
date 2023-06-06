import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import moment from "moment";
const { height, width } = Dimensions.get("window");

import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { OrdersCard, AppLoader } from "../../../../components";

import { useDispatch } from "react-redux";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";

export const NewList = (props) => {
  const { dataList, navigation, loader, onEndReached, ListFooterComponent } =
    props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  const getOrderDetail = async (id) => {
    // console.log("type", type)
    const userId = await Helper.getData("userId");
    setLoading(true);
    // dispatch(allActions.DataAction.ActivityModal(true));
    const response = await MindAxios.get(Env.paramUrl(`sale-orders`, id));
    // console.log(response);
    setLoading(false);
    // dispatch(allActions.DataAction.ActivityModal(false));
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
        date={date}
        id={item?.id}
        status={item?.status}
        amount={item?.subtotal}
        shipping={item?.shipping_fee}
        onPress={() => getOrderDetail(item?.id)}
      />
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      {dataList?.length ? (
        <FlatList
          data={dataList}
          renderItem={renderItem}
          onEndReached={onEndReached}
          ListFooterComponent={ListFooterComponent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mainItem}>
          {loader ? (
            <ActivityIndicator size="large" color={theme.theme} />
          ) : (
            <AppText style={styles.itemText}>
              You have no Item listed at this time
            </AppText>
          )}
        </View>
      )}
      {loading && <AppLoader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
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
