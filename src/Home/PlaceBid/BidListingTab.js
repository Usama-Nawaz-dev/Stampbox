import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import BidListing from "./BidListing";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";

import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from '../../../constant/colorsConfig';

export const BidListingTab = (props) => {
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [bidsList, setBidsList] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const ItemDetail = useSelector((state) => state.DetailReducer.auctionDetail);
  let _Id = ItemDetail?.feedable ? ItemDetail?.feedable?.id : ItemDetail?.id;

  useEffect(() => {
    if (isFocused) {
      getBids(_Id);
    }
  }, [isFocused]);

  const getBids = async (id) => {
    setLoading(true);
    const response = await MindAxios.get(Env.createUrl(`auctions/${id}/bids`));
    // console.log("bids", response);
    setLoading(false);
    if (response?.status == 200) {
      const _bidList = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      // console.log("bids", nextPageUrl);
      setBidsList(_bidList);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextBids = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(nextApiUrl);
      // console.log("bids", response);
      setIsLoading(false);
      if (response?.status == 200) {
        const _bidList = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        // console.log("bids", nextPageUrl);
        setBidsList(_bidList);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        alert(language?.serverError);
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
      {bidsList?.length ? (
        <FlatList
          data={bidsList}
          keyExtractor={(key) => key.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const lastIndex = index === bidsList?.length - 1;
            return <BidListing item={item} lastIndex={lastIndex} />;
          }}
          ListFooterComponent={renderFooter}
          onEndReached={getNextBids}
        />
      ) : (
        <View style={styles.mainItem}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.theme} />
          ) : (
            <AppText style={[styles.itemText, { color: theme?.theme }]}>
              {language?.you_have_no_Item_listed}{" "}
            </AppText>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(1),
    backgroundColor: colors.cWhite,
  },

  //Empty List
  mainItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: colors.cWhite,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
});
