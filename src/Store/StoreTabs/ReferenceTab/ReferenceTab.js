import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Share,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { ItemCard, ListingModal } from "../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";
import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";

export const ReferenceTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  //Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (focused) {
      getForReferenceItems();
    }
  }, [focused]);

  const getForReferenceItems = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(
        "stamp-items",
        `?user_id=${currentUser?.id}&status=FOR_REFERENCE`
      )
    );
    setLoading(false);
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      setList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };
  const getNextReferenceData = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${currentUser?.id}&status=FOR_REFERENCE`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setList([...list, ..._data]);
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

  const onEditStamp = async (stampId) => {
    const response = await MindAxios.get(Env.paramUrl("stamp-items", stampId));
    if (response?.status == 200) {
      const data = response?.data?.result?.stamp_item;
      dispatch(allActions.DataAction.StampDetail(data));
      dispatch(allActions.DataAction.SelectedImg(data?.medias));
      props.navigation.navigate("EditStamps", { item: data });
    } else {
      alert(language?.serverError);
    }
  };

  const onPressDetail = async (stampId) => {
    const response = await MindAxios.get(Env.paramUrl("stamp-items", stampId));
    if (response?.status == 200) {
      const data = response?.data?.result?.stamp_item;
      dispatch(allActions.DetailAction.StampDetail(data));
      props.navigation.navigate("StampDetail");
    } else {
      alert(language?.serverError);
    }
  };

  const listingChecker = (type) => {
    if (type === "Auction") {
      if (itemData?.status.includes("FOR_AUCTION")) {
        props.navigation.navigate("CreateAuction", { item: itemData });
        setModalVisible(false);
      } else {
        Helper.showToastMessage(
          "This Stamp is not available for Auction.",
          colors.blueTheme
        );
      }
    } else if (type === "Trade") {
      if (itemData?.status?.includes("FOR_TRADE")) {
        props.navigation.navigate("CreateTrade", { item: itemData });
        setModalVisible(false);
      } else {
        Helper.showToastMessage(
          "This Stamp is not available for Trade.",
          colors.blueTheme
        );
      }
    } else {
      Helper.showToastMessage("Coming Soon.", colors.blueTheme);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === list.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
        }}
      >
        <ItemCard
          Item={item}
          showBtn={false}
          onEdit={() => onEditStamp(item?.id)}
          onListPress={() => {
            setItemData(item);
            setModalVisible(true);
          }}
          onViewDetail={() => onPressDetail(item?.id)}
          onShare={() => onShare(item?.id)}
        />
      </View>
    );
  };

  const onShare = async (itemId) => {
    try {
      const result = await Share.share({
        message: `Please find my album item using this link: https://development.stampbox.com/stamp-items/${itemId}/show`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      {list?.length ? (
        <FlatList
          data={list}
          style={{ paddingHorizontal: wp(5) }}
          renderItem={renderItem}
          numColumns={2}
          ListFooterComponent={renderFooter}
          onEndReached={getNextReferenceData}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mainItem}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.theme} />
          ) : (
            <AppText style={[styles.itemText, { color: theme?.theme }]}>
              {language?.you_have_no_Item_listed}
            </AppText>
          )}
        </View>
      )}
      {/* Listing Modal */}
      <ListingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onListItem={(type) => listingChecker(type)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  mainItem: {
    flex: 1,
    // backgroundColor: colors.cWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
});
