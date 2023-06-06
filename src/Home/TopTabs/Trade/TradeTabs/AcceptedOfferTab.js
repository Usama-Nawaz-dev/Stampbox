import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

import { DataTab } from "./DataTab";
import colors from "../../../../../constant/colors";
import Empty from "../../../../../components/Empty";
import { EmptyList } from "../../../../../components";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import ThemeContext from "../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../constant/colorsConfig";

export const AcceptedOfferTab = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const tradeCrud = currentUser?.user_permissions?.includes(
    "my_store.for_trade.view"
  );

  const [tradeList, setTradeList] = useState(null);
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme }= useContext(ThemeContext);

  useEffect(() => {
    if (focused && tradeCrud) {
      getData();
    }
  }, [focused]);

  const getData = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl("trades", `?user_id=${userId}&type=offer-accepted`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      console.log("next>>", nextPageUrl);
      setTradeList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Sever Error.");
    }
  };

  const getNextApiData = async () => {
    const userId = await Helper.getData("userId");
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${userId}&type=offer-accepted`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setTradeList([...tradeList, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        setIsLoading(false);
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
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      {tradeList?.length ? (
        <DataTab
          DataList={tradeList}
          ListFooterComponent={renderFooter}
          onEndReached={getNextApiData}
          navigation={navigation}
        />
      ) : (
        <View style={styles.mainItem}>
          {tradeCrud ? (
            <Empty />
          ) : (
            <EmptyList description="Please update your plan for viewing items." />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
    paddingTop: hp(1),
  },
  mainItem: {
    flex: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
});
