import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { AuctionTab } from "./AuctionTab";
import colors from "../../../../../constant/colors";
import ThemeContext from "../../../../Context/ThemeContext";

export const ExpiryTab = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const auctionCount = useSelector(
    (state) => state.DetailReducer.auctionCounters
  );

  const auctionCrud = currentUser?.user_permissions?.includes("auctions.crud");

  const [auctionList, setAuctionList] = useState(null);
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (focused && auctionCrud) {
      getAuctionList();
    }
  }, [focused]);

  const getAuctionList = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`auctions`, `?user_id=${userId}&type=expired`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    const { status } = response;
    if (status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const total = response?.data?.result?.paginated_items?.total;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      dispatch(
        allActions.DetailAction.AuctionCounters({
          ...auctionCount,
          eCount: total,
        })
      );
      setNextApiUrl(nextPageUrl);
      setAuctionList(_data);
    } else {
      alert("Something went wrong");
    }
  };
  const getNextAuctionList = async () => {
    const userId = await Helper.getData("userId");
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${userId}&type=expired`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setAuctionList([...auctionList, ..._data]);
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
          color={colors.lightTheme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <AuctionTab
        dataList={auctionList}
        type="draft"
        header="Drafts"
        navigation={navigation}
        hideBtn={true}
        onEndReached={getNextAuctionList}
        listFooter={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(2),
    backgroundColor: colors.cWhite,
  },
});
