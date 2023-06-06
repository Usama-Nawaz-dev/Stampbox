import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";

import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { BountyOfferCard, MenuSheet } from "../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import Helper from "../../../Helper";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";
import Feather from "react-native-vector-icons/Feather";

export const PlaceOfferTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const {
    myState: { language },
  } = useContext(AuthContext);
  const [itemList, setItemList] = useState(null);
  const { theme } = useContext(ThemeContext);

  //Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("Stamp Item");
  const [filterOption, setFilterOption] = useState("StampItem");

  useEffect(() => {
    if (focused) {
      getMyOffers(filterOption);
    }
  }, [focused]);

  const getMyOffers = async (type) => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`bounty-offers`, `?user_id=${userId}&referable_type=${type}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    const { status } = response;
    if (status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      setItemList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Something went wrong");
    }
  };

  const getNextBounties = async () => {
    const userId = await Helper.getData("userId");
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${userId}&referable_type=${filterOption}`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setItemList([...itemList, ..._data]);
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
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: hp(2) }}
        />
      </View>
    ) : null;
  };

  const onStamps = () => {
    setTitle("Stamp Items");
    setFilterOption("StampItem");
    getMyOffers("StampItem");
  };
  const onAuctions = () => {
    setTitle("Auction Refs");
    setFilterOption("Auction");
    getMyOffers("Auction");
  };
  const onTrades = () => {
    setTitle("Trade Refs");
    setFilterOption("Trade");
    getMyOffers("Trade");
  };
  const onProducts = () => {
    setTitle("Product Refs");
    setFilterOption("Product");
    getMyOffers("Product");
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === itemList.length - 1;
    return (
      <View style={{ marginBottom: isEnd ? hp(2.5) : hp(1) }}>
        <BountyOfferCard
          ItemDetail={item}
          onViewDetail={() => {
            dispatch(allActions.DetailAction.BountyDetail(item?.bounty));
            props.navigation.navigate("BountyDetail");
          }}
          onChat={() => {
            let newItem = {};
            const name = item?.bounty?.user?.full_name
              ? item?.bounty?.user?.full_name
              : item?.bounty?.user?.first_name;
            newItem.from = name;
            newItem.type = item?.bounty?.user?.id;
            newItem.message = item?.bounty?.user?.image_url;
            dispatch(allActions.SheetAction.user_chat(newItem));
            props.navigation.navigate("ChatScreen", { newItem });
          }}
        />
      </View>
    );
  };

  const myIcon = (
    <Feather
      name="filter"
      size={hp(2.6)}
      color={theme?.darkGrey}
      style={{ transform: [{ rotateY: "180deg" }] }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors?.white }]}>
      <View style={styles.topSection}>
        <AppText style={styles.text}>
          {title}
        </AppText>
        <MenuSheet
          customButton={myIcon}
          options={[
            "Stamp Items",
            "Auction Refs",
            "Trade Refs",
            "Product Refs",
            "Cancel",
          ]}
          actions={[onStamps, onAuctions, onTrades, onProducts]}
        />
      </View>
      {itemList?.length ? (
        <FlatList
          data={itemList}
          renderItem={renderItem}
          style={styles.listStyle}
          onEndReached={getNextBounties}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={styles.emptyList}>
            {language?.you_have_no_listed_item}
            {"."}
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  listStyle: {
    paddingHorizontal: wp(3),
    paddingTop: hp(1),
  },
  emptyList: {
    fontSize: 12,
    fontWeight: "500",
    alignSelf: "center",
    color: colors.lightTheme
  },
  mainItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topSection: {
    marginTop: hp(1),
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wp(3),
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    fontFamily: Fonts.IBM_Medium,
  },
});
