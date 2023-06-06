import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";

import colors from "../../../../constant/colors";
import { MyBountyCard } from "../../../../components";
import AppText from "../../../../components/AppText";
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
// import { dark as theme } from "../../../../constant/colorsConfig";

const Data = [1, 2, 3, 4, 5];
export const DraftsTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [itemList, setItemList] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  //Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (focused) {
      getBounties();
    }
  }, [focused]);

  const getBounties = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`bounties`, `?user_id=${userId}&status=Draft`)
    );
    // console.log(response);
    dispatch(allActions.DataAction.AppLoader(false));
    const { status } = response;
    if (status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      // console.log(_data)
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
        nextApiUrl + `&user_id=${userId}&status=Draft`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        // console.log("next data...", _data);
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
          // animation={loder}
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  const activeAlert = (item) =>
    Alert.alert(
      "List In Marketplace ?",
      "Are you sure you want to list the item in marketplace ?",
      [{ text: "Cancel" }, { text: "OK", onPress: () => moveToActive(item) }]
    );

  const moveToActive = async (item) => {
    // console.log(item)
    const body = {
      title: item?.title,
      country: item?.country,
      year_issued: item?.year_issued,
      grade: item?.grade?.map((item) => item),
      condition: item?.condition?.map((item) => item),
      quality: item?.quality?.map((item) => item),
      format: item?.format?.map((item) => item),
      offered_coins: item?.offered_coins,
      offered_amount: item?.offered_amount,
      description: item?.description,
      status: "Active",
      media_ids: item?.medias?.map((item) => item.id),
      is_local: item?.is_local,
    };
    // console.log("------------>>>>>>>>", body);
    const response = await MindAxios.post(
      // Store Bounty -> Draft
      Env.paramUrl("bounties", item?.id),
      body
    );
    // console.log("------------>>>>>>>>", response);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response.status == 200) {
      getBounties();
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === Data.length - 1;
    return (
      <View style={{ marginBottom: hp(1.5), paddingRight: wp(3) }}>
        <MyBountyCard
          ItemDetail={item}
          onOption={() => activeAlert(item)}
          onEdit={() => {
            dispatch(allActions.DataAction.SelectedImg(item?.medias));
            props.navigation.navigate("EditBounty", { ItemDetail: item });
          }}
          onPress={() => {
            dispatch(allActions.DetailAction.BountyDetail(item));
            props.navigation.navigate("BountyDetail", { ItemDetail: item });
          }}
        />
      </View>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      {itemList?.length ? (
        <FlatList
          data={itemList}
          numColumns={2}
          style={styles.listStyle}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          onEndReached={getNextBounties}
          // showsVerticalScrollIndicator={false}
        />
      ) : (
        <AppText style={styles.emptyList}>
          {language?.you_have_no_listed_item}
        </AppText>
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
    marginTop: hp(1),
  },
  emptyList: {
    alignSelf: "center",
    marginTop: hp(20),
    // color: colors.lightText,
    fontWeight: "500",
    fontSize: 12,
  },
});
