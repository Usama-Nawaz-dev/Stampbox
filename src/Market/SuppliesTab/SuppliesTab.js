import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import { SuppliesCard } from "./SuppliesCard";
import { EmptyList, BottomSheet } from "../../../components";

import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import AuthContext from "../../Context/AuthContext";
import { useIsFocused } from "@react-navigation/native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import { ItemSheet } from "../../Sheets";
import { SearchComp } from "../SearchComp";
import { SelectionSheet } from "../../Sheets";
import { SupplyFilterSheet } from "../MarketSheets/SupplyFilterSheet";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

const shippingData = [
  "Pickup Only",
  "Shipping Local/Domestic Only (Country)",
  "Shipping International",
];

export const SuppliesTab = ({ navigation }) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const singleSheetRef = useRef();
  const filterSheetRef = useRef();
  const mulSelectionSheet = useRef();
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [currentList, setCurrentList] = useState(null);
  const [listChanged, setListChanged] = useState(false);
  const [suppliesList, setSuppliesList] = useState(null);

  const [page, setPage] = useState(1);
  const [endPage, setEndPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValues, setFilterValue] = useState(null);

  const [data, setData] = useState(null);
  const [title, setTitle] = useState(null);
  const [sheetHeight, setSheetHeight] = useState(null);
  const [categoryList, setCategoryList] = useState(null);

  useEffect(() => {
    if (focused) {
      fetchData();
    } else {
      resetFilterValues();
    }
  }, [focused]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchData = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    await getSupplies();
    dispatch(allActions.DataAction.AppLoader(false));
  };

  const getSupplies = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`products`, `?is_published=2&productable_type=Supply`)
    );
    const error = response?.response?.data;
    if (response?.status == 200) {
      const data = response?.data?.result?.paginated_items?.data;
      const endPage = response?.data?.result?.paginated_items?.last_page;
      setPage(1);
      setEndPage(endPage);
      setCurrentList(data);
      setSuppliesList(data);
    } else {
      Helper.showToastMessage(`${error?.message}`, colors.danger);
    }
  };

  const fetchMoreSupplies = async () => {
    if (page < endPage && suppliesList?.length >= 10) {
      setLoading(true);
      const response = await MindAxios.get(
        Env.paramUrl(
          `products`,
          `?is_published=2&productable_type=Supply&page=${page + 1}`
        )
      );
      setLoading(false);
      const error = response?.response?.data;
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setPage(page + 1);
        setSuppliesList([...suppliesList, ..._data]);
        setCurrentList([...suppliesList, ..._data]);
      } else {
        alert("Error", `${error?.message}`);
      }
    }
  };

  const toggleFav = async (item) => {
    let body = {
      wishable_type: "Product",
      wishable_id: item?.id,
    };
    const response = await MindAxios.post(Env.createUrl("wishlists"), body);
    if (response?.status == 200) {
      if (item.is_wishable === 1) {
        item.is_wishable = 0;
        setListChanged(!listChanged);
        Helper.showToastMessage("Product removed from wishlist", colors.green);
      } else {
        item.is_wishable = 1;
        setListChanged(!listChanged);
        Helper.showToastMessage("Product added to wishlist", colors.green);
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

  const onRefresh = async () => {
    setIsLoading(true);
    await getSupplies();
    setIsLoading(false);
  };

  const renderItem = ({ item, index }) => (
    <View
      style={{
        marginRight: wp(3),
        marginBottom: hp(1.5),
      }}
    >
      <SuppliesCard
        ItemDetail={item}
        onFlag={() => {
          navigation.navigate("Flagging", {
            id: item?.productable?.id,
          });
        }}
        onPressBtn={() => {
          Helper.fbEvent("supply_open_from_market");
          dispatch(allActions.DetailAction.StampDetail(item));
          navigation.navigate("ProductStack");
        }}
        onPressUser={() => {
          // navigation.navigate("OtherUser", { user: item?.user })
          dispatch(allActions.DetailAction.OtherUser(item?.user));
          navigation.navigate("ProfileStack");
        }}
        onToggleFav={() => toggleFav(item)}
        gotoChat={() => {
          let name = item?.user?.full_name
            ? item?.user?.full_name
            : item?.user?.first_name;
          // console.log('item', item);
          item.type = item?.user?.id;
          item.from = name;
          item.message = item?.user?.image_url;
          dispatch(allActions.SheetAction.user_chat(item));
          navigation.navigate("ChatScreen");
        }}
      />
    </View>
  );

  const fetchCategories = async () => {
    const response = await MindAxios.get(
      Env.createUrl("categories/?type=supplies")
    );
    if (response?.status == 200) {
      const data = response?.data?.result?.categories;
      let newData = data.map(({ name: key, ...rest }) => ({
        key,
        ...rest,
        isSelected: false,
      }));
      setCategoryList(newData);
    }
  };

  const filterCategories = categoryList?.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });

  const placeHolderChecker = (item, placeHolder) => {
    if (item?.length == 1) {
      return item[0]?.key;
    } else if (item?.length === 1) {
      return `${item[0]?.key}`;
    } else if (item?.length === 2) {
      return `${item[0]?.key} , ${item[1]?.key}`;
    } else if (item?.length > 2) {
      return `${item[0]?.key} , ${item[1]?.key} & more`;
    } else {
      return placeHolder;
    }
  };

  // Sale Filters Checkers
  const typeCheck = (type) => {
    if (type === "Category") {
      setSheetHeight(hp(94));
      setTitle("Categories");
      setData(categoryList);
      mulSelectionSheet?.current?.open();
    } else if (type === "Shipping") {
      setTitle(type);
      setData(shippingData);
      setSheetHeight(hp(25));
      singleSheetRef?.current?.open();
    }
  };

  const itemCheck = (val, index) => {
    if (title == "Shipping") {
      setFilterValue({ ...filterValues, shiping_option: `${val}` });
    }
  };

  const selectionChecker = (selected, index) => {
    if (title === "Categories") {
      toggleItem(selected, index, categoryList, setCategoryList);
    }
  };

  const toggleItem = (selected, i, data, setState) => {
    if (selected) {
      var res = data.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: false,
          };
        } else {
          return item;
        }
      });
      setState(res);
    } else {
      var res = data.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: true,
          };
        } else {
          return item;
        }
      });
      setState(res);
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

    if (filterCategories?.length) {
      filterCategories?.map((item, index) => {
        if (query.length === 0) {
          query = query.concat(`category_ids[]=${item.id}`);
        } else {
          query = query.concat(`&category_ids[]=${item.id}`);
        }
      });
    }
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(
        `products`,
        `?productable_type=Supply&page_size=9&is_published=2&${query}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setSuppliesList(_data);
    } else {
      alert(language?.serverError);
    }
  };

  const resetSelectedValues = (data, setState) => {
    const listData = data?.map((item, index) => {
      return {
        ...item,
        isSelected: false,
      };
    });
    setState(listData);
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
        Env.paramUrl(
          `products`,
          `?productable_type=Supply&is_published=2&page_size=9&search=${x}`
        )
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setSuppliesList(_data);
      }
    } else {
      setSuppliesList(currentList);
    }
  };

  const resetFilterValues = () => {
    setFilterValue(null);
    resetSelectedValues(categoryList, setCategoryList);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SearchComp
        onTermChange={(value) => searchItems(value)}
        onTermSubmit={(value) => searchItems(value)}
        onFilter={() => filterSheetRef?.current?.open()}
      />
      {suppliesList?.length ? (
        <FlatList
          numColumns={2}
          data={suppliesList}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={isLoading}
              tintColor={colors.lightTheme}
            />
          }
          refreshing={isLoading}
          renderItem={renderItem}
          extraData={listChanged}
          style={styles.listStyle}
          onEndReached={fetchMoreSupplies}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.itemView}>
          <EmptyList description={language?.YouDontHhaveAanyActiveItem} />
        </View>
      )}

      {/* Filter Sheet */}
      <BottomSheet
        ref={filterSheetRef}
        sheetHeight={hp(37)}
        ChildComponent={
          <SupplyFilterSheet
            filterValues={filterValues}
            setFilterValue={setFilterValue}
            filterCategories={filterCategories}
            placeHolderChecker={placeHolderChecker}
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
              setSuppliesList(currentList);
              resetFilterValues();
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
          }, 300);
        }}
        dropDown={false}
        sheetHeight={sheetHeight}
        ChildComponent={
          <ItemSheet
            Data={data}
            onPress={(val, index) => {
              singleSheetRef?.current?.close();
              itemCheck(val, index);
              setTimeout(() => {
                filterSheetRef?.current?.open();
              }, 300);
            }}
          />
        }
      />

      {/* Multiple Item Selection Sheet */}
      <BottomSheet
        ref={mulSelectionSheet}
        title={`Filter By ${title}`}
        onPressClose={() => {
          mulSelectionSheet?.current?.close();
          setTimeout(() => {
            filterSheetRef?.current?.open();
          }, 300);
        }}
        dropDown={false}
        sheetHeight={sheetHeight}
        ChildComponent={
          <SelectionSheet
            Data={data}
            onValueChange={(selected, index) => {
              selectionChecker(selected, index);
            }}
          />
        }
      />
    </View>
  );
};
