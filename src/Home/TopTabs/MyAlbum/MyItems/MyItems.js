import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Share,
  Alert,
  Linking,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import { BundleSheet } from "./BundleSheet";
import { ItemSheet } from "../../../../Sheets";
import colors from "../../../../../constant/colors";
import { ItemFilterSheet } from "./ItemFilterSheet";
import AppText from "../../../../../components/AppText";
import { SearchComp } from "../../../../Market/SearchComp";
import OnlyDropDown from "../../../../../components/OnlyDropDown";
import { stampItemStatuses } from "../../../../../constant/staticData";

import {
  GradBtn,
  ItemCard,
  MainHeader,
  BottomSheet,
  ListingModal,
} from "../../../../../components";

import {
  countries,
  stampFormatTypes,
} from "../../../../../constant/staticData";

import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import { appUrl } from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

export const MyItems = (props) => {
  const from = props.route.params;
  const dispatch = useDispatch();
  const focused = useIsFocused();

  // Sheet Ref's
  const filterSheetRef = useRef();
  const singleSheetRef = useRef();
  const bundleSheetRef = useRef();

  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [stampList, setStampList] = useState(null);
  const [currentList, setCurrentList] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState("All Items");

  const [sheetHeight, setSheetHeight] = useState(null);
  const [filterValues, setFilterValue] = useState(null);
  const [title, setTitle] = useState(null);

  const {
    myState: { language },
  } = useContext(AuthContext);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nextValue, setNextValue] = useState("");
  const [listChanged, setListChanged] = useState(true);
  const { theme, mood } = useContext(ThemeContext);

  const statusList = stampItemStatuses?.map(
    ({ key: value, text: label, ...rest }) => ({
      value,
      label,
      ...rest,
    })
  );

  const countryList = countries?.map((item) => item.value);
  const formatList = stampFormatTypes?.map((item) => item.value);
  const [sheetData, setSheetData] = useState(null);

  useEffect(() => {
    if (focused) {
      fetchData();
    } else {
      resetFilterValues();
    }
  }, [focused]);

  const fetchData = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    await getStampList("");
    dispatch(allActions.DataAction.AppLoader(false));
  };

  const getStampList = async (value) => {
    const response = await MindAxios.get(
      Env.paramUrl("stamp-items", `?user_id=${currentUser?.id}&status=${value}`)
    );
    // console.log("stamplist....", response);
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      const myData = _data.map((item) => {
        item.isSelected = false;
        return item;
      });
      setStampList(myData);
      setCurrentList(myData);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Sever Error.");
    }
  };

  const getNextStampList = async (value) => {
    // console.log("status...", status);
    if (nextApiUrl !== null && stampList?.length >= 10) {
      setIsLoading(true);
      // console.log("next....Api....url.....",nextApiUrl);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${currentUser?.id}&status=${value}`
      );
      // console.log("response....2", response);
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        const myData = _data.map((item) => {
          item.isSelected = false;
          return item;
        });
        setStampList([...stampList, ...myData]);
        setCurrentList([...stampList, ...myData]);
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
          color={colors.lightTheme}
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

  const removeAlbumAlert = (id) =>
    Alert.alert(
      `Remove Stamp From Albums ?`,
      `Are you sure you want to remove this Stamp  ?`,
      [{ text: "Cancel" }, { text: "OK", onPress: () => removeFromAlbum(id) }]
    );

  const removeFromAlbum = async (id) => {
    const body = { stamp_item_ids: `[${id}]` };
    const response = await MindAxios.post(
      Env.createUrl("albums/detach-items"),
      body
    );
    // console.log(response);
    if (response?.status === 200) {
      Helper.showToastMessage(
        "Stamp removed from albums successfully.",
        colors.green
      );
      getStampList("");
    } else {
      Helper.showToastMessage(
        "There's some issue while removing stamp from album.",
        colors.danger
      );
    }
  };

  const onToggleCheck = (item) => {
    item.isSelected = !item?.isSelected;
    setListChanged(!listChanged);
  };

  const selectedStamps = stampList?.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });

  const renderItem = ({ item, index }) => {
    const isEnd = index === stampList.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
          marginLeft: index % 2 == 0 ? 2 : 0,
        }}
      >
        <ItemCard
          Item={item}
          showBtn={false}
          showRemove={true}
          onEdit={() => onEditStamp(item?.id)}
          onListPress={() => {
            setItemData(item);
            setModalVisible(true);
          }}
          onViewDetail={() => onPressDetail(item?.id)}
          onRemove={() => removeAlbumAlert(item?.id)}
          onShare={() => onShare(item?.id)}
          onToggleCheck={() => onToggleCheck(item)}
        />
      </View>
    );
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

  const onBack = () => {
    if (from == "drawer") {
      setStatus("All Items");
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      setStatus("All Items");
      props.navigation.goBack();
    }
  };

  const typeCheck = (type) => {
    if (type === "Format") {
      setTitle(type);
      setSheetData(formatList);
      setSheetHeight(hp(82));
    } else if (type === "Country") {
      setTitle("Countries");
      setSheetData(countryList);
      setSheetHeight(hp(94));
    }
    singleSheetRef?.current?.open();
  };

  const itemCheck = (val, index) => {
    if (title == "Countries") {
      setFilterValue({ ...filterValues, country: `${val}` });
    } else if (title == "Format") {
      setFilterValue({ ...filterValues, format: `${val}` });
    }
  };

  const onRefresh = async () => {
    setLoading(true);
    await getStampList("");
    resetFilterValues();
    setLoading(false);
  };

  const INTERVAL = 1500;
  const searchItems = debounce(
    (x) => {
      onSearchData(x);
    },
    INTERVAL,
    { leading: true, trailing: false, maxWait: INTERVAL }
  );

  const onSearchData = async (x) => {
    if (x) {
      setLoading(true);
      const response = await MindAxios.get(
        Env.paramUrl(
          `stamp-items`,
          `?user_id=${currentUser?.id}&page_size=9&search=${x}`
        )
      );
      setLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setStampList(_data);
      }
    } else {
      setStampList(currentList);
    }
  };

  const onApplyFilter = async () => {
    let query = "";
    if (filterValues !== null) {
      query = Object.keys(filterValues)
        .map((k) => {
          if (Array.isArray(filterValues[k])) {
            return filterValues[k].map((val) => `${k}=${val}`).join("&");
          }
          return `${k}=${filterValues[k]}`;
        })
        .join("&");
    }

    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(
        `stamp-items`,
        `?user_id=${currentUser?.id}&page_size=9&${query}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setStampList(_data);
    } else {
      alert(language?.serverError);
    }
  };

  const resetFilterValues = () => {
    setStatus("All Items");
    setFilterValue(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        onPressBack={onBack}
        title={language?.myItems}
        rightIcon={
          <View style={styles.rightSection}>
            <TouchableOpacity
              // style={styles.icon}
              onPress={() => {
                props.navigation.navigate("AddStamps", { item: false });
              }}
            >
              <Ionicons
                name="add-circle-outline"
                size={hp(3)}
                color={colors.cWhite}
              />
            </TouchableOpacity>
          </View>
        }
      />
      <SearchComp
        onTermChange={(value) => searchItems(value)}
        onTermSubmit={(value) => searchItems(value)}
        onFilter={() => filterSheetRef?.current?.open()}
        // onFilter={() => filterSheetRef?.current?.open()}
      />
      <View style={styles.upperSection}>
        <AppText style={styles.leftText}>{status}</AppText>
        <View style={styles.filterIcon}>
          <OnlyDropDown
            data={statusList}
            dropdownOffset={5}
            width="40%"
            left={wp(15)}
            onChangeText={(value) => {
              setStatus(value);
              setNextValue(value);
              getStampList(value);
            }}
            icon={() => (
              <Feather
                name="filter"
                size={hp(2.6)}
                style={{ transform: [{ rotateY: "180deg" }] }}
              />
            )}
          />
        </View>
      </View>
      {stampList?.length ? (
        <FlatList
          numColumns={2}
          data={stampList}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={loading}
              tintColor={colors.lightTheme}
            />
          }
          refreshing={loading}
          extraData={listChanged}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          style={{ paddingHorizontal: wp(5) }}
          showsVerticalScrollIndicator={false}
          onEndReached={() => getNextStampList(nextValue)}
        />
      ) : (
        <View style={[styles.mainItem, { backgroundColor: theme?.white }]}>
          <AppText style={styles.itemText}>
            You have no Item listed at this time.
          </AppText>
        </View>
      )}

      {selectedStamps?.length ? (
        <>
          <View style={{ marginTop: hp(6) }} />
          <GradBtn
            width={"90%"}
            height={hp(5.5)}
            fontSize={16}
            label={`Selected ${selectedStamps?.length}`}
            fontWeight={"500"}
            style={styles.bottomButton}
            onPress={() => bundleSheetRef?.current?.open()}
            icon={
              <Feather name="chevron-down" size={hp(3)} color={colors.cWhite} />
            }
          />
        </>
      ) : null}

      {/* Stamp Listing Modal */}
      <ListingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onListItem={(type) => listingChecker(type)}
      />

      {/* Filter Sheet */}
      <BottomSheet
        ref={filterSheetRef}
        sheetHeight={hp(35)}
        ChildComponent={
          <ItemFilterSheet
            filterValues={filterValues}
            setFilterValue={setFilterValue}
            onPressItem={(val) => {
              filterSheetRef?.current?.close();
              setTimeout(() => {
                typeCheck(val);
              }, 350);
            }}
            onApplyFilter={() => {
              filterSheetRef?.current?.close();
              onApplyFilter();
            }}
            onReset={() => {
              filterSheetRef?.current?.close();
              setFilterValue(null);
              setStampList(currentList);
            }}
          />
        }
      />
      {/* Selection Sheet */}
      <BottomSheet
        ref={singleSheetRef}
        title={`Filter By ${title}`}
        onPressClose={() => {
          singleSheetRef?.current?.close();
          setTimeout(() => {
            filterSheetRef?.current?.open();
          }, 350);
        }}
        dropDown={false}
        sheetHeight={sheetHeight}
        ChildComponent={
          <ItemSheet
            Data={sheetData}
            onPress={(val, index) => {
              singleSheetRef?.current?.close();
              itemCheck(val, index);
              setTimeout(() => {
                filterSheetRef?.current?.open();
              }, 350);
            }}
          />
        }
      />

      {/* Bundle Sheet */}
      <BottomSheet
        ref={bundleSheetRef}
        sheetHeight={hp(45)}
        ChildComponent={
          <BundleSheet
            onPrint={() => {
              bundleSheetRef?.current?.close();
              setTimeout(() => {
                const ids = selectedStamps?.map((st) => st?.id);
                Linking.openURL(appUrl + `print-items?stampItems=${JSON.stringify(ids)}`);
              }, 350);
            }}
            onBundleStamp={(type) => {
              bundleSheetRef?.current?.close();
              setTimeout(() => {
                props?.navigation?.navigate("BundleStamp", {
                  type: type,
                  listData: selectedStamps,
                });
              }, 350);
            }}
          />
        }
      />
    </View>
  );
};
