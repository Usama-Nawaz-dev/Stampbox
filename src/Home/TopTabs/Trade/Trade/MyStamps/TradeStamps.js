import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, ActivityIndicator, Share } from "react-native";

import { styles } from "./styles";
import Btn from "../../../../../../components/Btn";
import colors from "../../../../../../constant/colors";
import AppText from "../../../../../../components/AppText";
import {
  SimpleHeader,
  ItemCard,
  ListingModal,
} from "../../../../../../components";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Helper from "../../../../../Helper";
import Env from "../../../../../../api/Env";
import MindAxios from "../../../../../../api/MindAxios";
import allActions from "../../../../../../redux/actions";
import AuthContext from "../../../../../Context/AuthContext";
import ThemeContext from "../../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../../constant/colorsConfig";

import { appUrl } from "../../../../../../api/Env";

export const TradeStamps = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [stampList, setStampList] = useState(null);
  const [currentData, setCurrentData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [statusCheck, setStatusCheck] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useContext(ThemeContext);

  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused) {
      fetchStamps();
    }
  }, [focused]);

  const fetchStamps = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl("stamp-items", `?user_id=${userId}&status=FOR_TRADE`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      // console.log("next...?", nextPageUrl, response);
      setStampList(_data);
      setCurrentData(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };
  const getNextStamps = async () => {
    const userId = await Helper.getData("userId");
    // console.log("next here>>>>>>>>>>", nextApiUrl);
    if (nextApiUrl !== null && stampList.length >= 10) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${userId}&status=FOR_TRADE`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;

        setStampList([...stampList, ..._data]);
        setCurrentData([...currentData, ..._data]);
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

  const searchStampsApi = async (x) => {
    const userId = await Helper.getData("userId");
    if (x) {
      let text = x.toLowerCase();
      let filterTrades = stampList.filter((item) => {
        return item.name.toLowerCase().match(text);
      });
      setStampList(filterTrades);
      // setLoading(true)
      // const response = await MindAxios.get(
      //     Env.createUrl(`stamp-items?user_id=${userId}&search=${x}`)
      // );
      // setLoading(false)
      // if (response?.status == 200) {
      //     const _data = response?.data?.result?.paginated_items?.data;
      //     setStampList(_data);
      // }
    } else {
      setStampList(currentData);
    }
  };

  const onShare = async (itemId) => {
    try {
      const result = await Share.share({
        message: `Please find my album item using this link: ${appUrl}stamp-items/${itemId}/show`,
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

  const renderItem = ({ item, index }) => {
    const isEnd = index === stampList.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginLeft: index % 2 == 0 ? 2 : 0,
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
        }}
      >
        <ItemCard
          Item={item}
          onEdit={() => onEditStamp(item?.id)}
          onViewDetail={() => onPressDetail(item?.id)}
          onShare={() => onShare(item?.id)}
          onListPress={() => {
            setItemData(item);
            setModalVisible(true);
          }}
        />
      </View>
    );
  };

  const onEditStamp = async (stampId) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl("stamp-items", stampId));
    dispatch(allActions.DataAction.AppLoader(false));
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
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl("stamp-items", stampId));
    dispatch(allActions.DataAction.AppLoader(false));
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

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SimpleHeader
        title={language?.myStamp}
        showIcon={true}
        showSearch={true}
        showFilter={false}
        onPressBack={() => props.navigation.goBack()}
        onChangeValue={(text) => searchStampsApi(text)}
        onPressAdd={() =>
          props.navigation.navigate("AddStamps", { item: false })
        }
      />
      {loading && (
        <ActivityIndicator
          color={colors.color8}
          size="small"
          style={{ marginTop: hp(2) }}
        />
      )}
      {stampList?.length ? (
        <FlatList
          numColumns={2}
          data={stampList}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.5}
          onEndReached={getNextStamps}
          style={styles.listStyle}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={styles.itemText}>
            {language?.you_have_no_Item_listed}
          </AppText>
          <Btn
            label={language?.addStamp}
            fontSize={12}
            height={40}
            width={wp(36)}
            style={{ marginTop: hp(1.5) }}
            iconLeft={
              <SimpleLineIcons
                name="plus"
                size={22}
                color="#fff"
                style={{ marginRight: 5 }}
              />
            }
            onPress={() =>
              props.navigation.navigate("AddStamps", { item: false })
            }
          />
        </View>
      )}
      <ListingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onListItem={(type) => listingChecker(type)}
      />
    </View>
  );
};
