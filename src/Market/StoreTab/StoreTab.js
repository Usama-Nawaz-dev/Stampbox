import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import { EmptyList, BottomSheet, StoreCard } from "../../../components";

import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import { SearchComp } from "../SearchComp";
import AppText from "../../../components/AppText";
import { StoresFilterSheet } from "../MarketSheets";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const StoreTab = ({ navigation }) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const filterSheetRef = useRef();

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [listChanged, setListChanged] = useState(false);
  const [sortList, setSortList] = useState(null);

  const [storeList, setStoreList] = useState(null);
  const [otherStores, setOtherStores] = useState(null);
  const [topSellerStore, setTopSellerStore] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [filterValues, setFilterValue] = useState(null);

  useEffect(() => {
    if (focused) {
      fetchData();
      getOtherStore();
      getNearbyStores();
    } else {
      resetFilterValues();
    }
  }, [focused]);

  const fetchData = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    await getSellerStore();
    dispatch(allActions.DataAction.AppLoader(false));
  };

  const getSellerStore = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`stores`, `?order_by=best_seller&page_size=40`)
    );
    const error = response?.response?.data;
    if (response?.status == 200) {
      const data = response?.data?.result?.paginated_items?.data;
      console.log(data?.length);
      const endPage = response?.data?.result?.paginated_items?.last_page;
      setTopSellerStore(data);
    } else {
      Helper.showToastMessage(`${error?.message}`, colors.danger);
    }
  };

  const getNearbyStores = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`stores`, `?near_by=1&page_size=40`)
    );
    const error = response?.response?.data;
    if (response?.status == 200) {
      const data = response?.data?.result?.paginated_items?.data;
      const endPage = response?.data?.result?.paginated_items?.last_page;
      setStoreList(data);
    } else {
      Helper.showToastMessage(`${error?.message}`, colors.danger);
    }
  };

  const getOtherStore = async () => {
    const response = await MindAxios.get(Env.createUrl(`stores`));
    const error = response?.response?.data;
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextUrl = response?.data?.result?.paginated_items?.next_page_url;
      setNextPageUrl(nextUrl);
      setOtherStores(_data);
    } else {
      Helper.showToastMessage(`${error?.message}`, colors.danger);
    }
  };

  const fetchMoreStores = async () => {
    if (nextPageUrl !== null && otherStores?.length >= 10) {
      setLoading(true);
      const response = await MindAxios.get(nextPageUrl);
      setLoading(false);
      const error = response?.response?.data;
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextUrl = response?.data?.result?.paginated_items?.next_page_url;
        setNextPageUrl(nextUrl);
        setOtherStores([...otherStores, ..._data]);
      } else {
        alert("Error", `${error?.message}`);
      }
    }
  };

  const saveStore = async (item) => {
    let body = {
      book_markable_id: item?.id,
      book_markable_type: "Store",
    };
    const response = await MindAxios.post(Env.createUrl("bookmarks"), body);
    if (response?.status == 200) {
      if (item.is_book_marked === 1) {
        item.is_book_marked = 0;
        setListChanged(!listChanged);
        Helper.showToastMessage("Store book mark removed.", colors.green);
      } else {
        item.is_book_marked = 1;
        setListChanged(!listChanged);
        Helper.showToastMessage("Store book mark added.", colors.green);
      }
    } else {
      alert(language?.serverError);
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.loader}>
        {loading && <ActivityIndicator size="large" color={theme?.theme} />}
      </View>
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={{ marginRight: wp(3) }}>
      <StoreCard
        ItemDetail={item}
        onPressUser={() => {
          dispatch(allActions.DetailAction.OtherUser(item?.owner));
          navigation.navigate("ProfileStack");
        }}
        onSaveStore={() => saveStore(item)}
        onShowStore={() => {
          dispatch(allActions.DetailAction.StoreDetail(item));
          if (currentUser?.id === item?.user_id) {
            navigation.navigate("MyStoreStack", { screen: "MyStore" });
          } else {
            navigation.navigate("UserStore");
          }
        }}
      />
    </View>
  );

  const renderStores = ({ item, index }) => {
    return (
      <View
        style={{
          marginRight: wp(3),
          marginBottom: hp(1.5),
        }}
      >
        <StoreCard
          ItemDetail={item}
          onPressUser={() => {
            dispatch(allActions.DetailAction.OtherUser(item?.owner));
            navigation.navigate("ProfileStack");
          }}
          onSaveStore={() => saveStore(item)}
          onShowStore={() => {
            dispatch(allActions.DetailAction.StoreDetail(item));
            if (currentUser?.id === item?.user_id) {
              navigation.navigate("MyStoreStack", { screen: "MyStore" });
            } else {
              navigation.navigate("UserStore");
            }
          }}
        />
      </View>
    );
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
    const response = await MindAxios.get(Env.paramUrl(`stores`, `?${query}`));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      if (_data?.length) {
        setSortList(_data);
      } else {
        Helper.showToastMessage("No Data Found.", colors.blueTheme);
      }
    } else {
      alert(language?.serverError);
    }
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
      setIsLoading(true);
      const response = await MindAxios.get(
        Env.paramUrl(`stores`, `?search=${x}`)
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        if (_data?.length) {
          setSortList(_data);
        } else {
          Helper.showToastMessage("No data found.", colors.blueTheme);
          setSortList(null);
        }
      }
    } else {
      setSortList(null);
    }
  };

  const resetFilterValues = () => {
    setFilterValue(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SearchComp
        onTermChange={(value) => searchItems(value)}
        onTermSubmit={(value) => searchItems(value)}
        onFilter={() => filterSheetRef?.current?.open()}
      />

      {sortList?.length ? (
        <FlatList
          numColumns={2}
          data={sortList}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              tintColor={colors.lightTheme}
            />
          }
          refreshing={isLoading}
          renderItem={renderStores}
          extraData={listChanged}
          style={styles.listStyle}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView>
          <AppText style={styles.heading}>Best Sellers</AppText>
          {topSellerStore?.length ? (
            <FlatList
              horizontal={true}
              data={topSellerStore}
              renderItem={renderItem}
              extraData={listChanged}
              style={styles.listStyle}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <View style={styles.itemView}>
              <EmptyList description={language?.YouDontHhaveAanyActiveItem} />
            </View>
          )}
          <AppText style={styles.heading}>Stores Nearby You</AppText>
          {storeList?.length ? (
            <FlatList
              data={storeList}
              horizontal={true}
              renderItem={renderItem}
              extraData={listChanged}
              style={styles.listStyle}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <View style={styles.itemView}>
              <EmptyList description={language?.YouDontHhaveAanyActiveItem} />
            </View>
          )}
          <AppText style={styles.heading}>Ohter Stores</AppText>
          {otherStores?.length ? (
            <FlatList
              horizontal={true}
              data={otherStores}
              renderItem={renderItem}
              extraData={listChanged}
              style={styles.listStyle}
              onEndReached={fetchMoreStores}
              keyExtractor={(item) => item.id}
              ListFooterComponent={renderFooter}
            />
          ) : (
            <View style={styles.itemView}>
              <EmptyList description={language?.YouDontHhaveAanyActiveItem} />
            </View>
          )}
          <View style={{ marginBottom: hp(2) }} />
        </ScrollView>
      )}

      {/* Filter Sheet */}
      <BottomSheet
        ref={filterSheetRef}
        sheetHeight={hp(45)}
        ChildComponent={
          <StoresFilterSheet
            filterValues={filterValues}
            setFilterValue={setFilterValue}
            onPressItem={(val) => {
              filterSheetRef?.current?.close();
              setTimeout(() => {
                typeCheck(val);
              }, 300);
            }}
            onApplyFilter={() => {
              filterSheetRef?.current?.close();
              onApplyFilter();
            }}
            onReset={() => {
              filterSheetRef?.current?.close();
              setSortList(null);
              resetFilterValues();
            }}
          />
        }
      />
    </View>
  );
};
