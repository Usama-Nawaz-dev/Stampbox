import React, { useContext, useState } from "react";
import {
  View,
  Share,
  Alert,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";

import Helper from "../../../../Helper";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import { ItemCard, ListingModal } from "../../../../../components";

import { useDispatch } from "react-redux";
const { height, width } = Dimensions.get("window");

import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { appUrl } from "../../../../../api/Env";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

export const AlbumList = ({
  album,
  showBtn,
  ItemList,
  navigation,
  onEndReached,
  getAlbumList,
  ListFooterComponent,
  ...otherProps
}) => {
  // const { navigation, ItemList, showBtn, ListFooterComponent, onEndReached, ...otherProps } = props;
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [itemData, setItemData] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme, mood } = useContext(ThemeContext);

  const renderItem = ({ item, index }) => {
    const isEnd = index === ItemList.length - 1;
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
          showRemove={true}
          showBtn={!showBtn}
          onEdit={() => onEditStamp(item?.id)}
          onViewDetail={() => onPressDetail(item?.id)}
          onListPress={() => {
            setItemData(item);
            setModalVisible(true);
          }}
          onShare={() => onShare(item?.id)}
          onRemove={() => removeStampAlert(item?.id)}
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
      navigation.navigate("EditStamps", { item: data });
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
      navigation.navigate("StampDetail");
    } else {
      alert(language?.serverError);
    }
  };

  const listingChecker = (type) => {
    if (type === "Auction") {
      if (itemData?.status.includes("FOR_AUCTION")) {
        navigation.navigate("CreateAuction", { item: itemData });
        setModalVisible(false);
      } else {
        Helper.showToastMessage(
          "This Stamp is not available for Auction.",
          colors.blueTheme
        );
      }
    } else if (type === "Trade") {
      if (itemData?.status?.includes("FOR_TRADE")) {
        navigation.navigate("CreateTrade", { item: itemData });
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

  const removeStampAlert = (id) =>
    Alert.alert(
      `Remove Stamp From Album ?`,
      `Are you sure you want to remove this Stamp  ?`,
      [{ text: "Cancel" }, { text: "OK", onPress: () => removeStamp(id) }]
    );

  const removeStamp = async (id) => {
    const body = { stamp_item_ids: `[${id}]`, album_ids: `[${album?.id}]` };
    const response = await MindAxios.post(
      Env.createUrl("albums/detach-items"),
      body
    );
    if (response?.status === 200) {
      Helper.showToastMessage(
        "Stamp removed from album successfully.",
        colors.green
      );
      getAlbumList();
    } else {
      Helper.showToastMessage(
        "There's some issue while removing stamp from album.",
        colors.danger
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      {ItemList?.length ? (
        <FlatList
          numColumns={2}
          data={ItemList}
          renderItem={renderItem}
          style={{ paddingHorizontal: wp(5) }}
          ListFooterComponent={ListFooterComponent}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          {...otherProps}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={[styles.itemText, { color: theme?.theme }]}>
            {language?.you_have_no_Item_listed}
          </AppText>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: colors.cWhite,
  },
  mainItem: {
    width: width,
    marginTop: hp(15),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
});
