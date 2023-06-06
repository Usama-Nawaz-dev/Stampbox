import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import { SuppliesCard } from "../SuppliesTab/SuppliesCard";
import { EmptyList, BottomSheet } from "../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import AuthContext from "../../Context/AuthContext";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import { ItemSheet } from "../../Sheets";
import { SearchComp } from "../SearchComp";
import { SelectionSheet } from "../../Sheets";
import { SaleFilterSheet } from "../MarketSheets";

const yearList = [
  "Before 1950",
  "1950 - 1960",
  "1960 - 1970",
  "1970 - 1980",
  "1980 - 1990",
  "1990 - 2000",
  "2000 - 2010",
  "2010 - 2020",
  "2020 - Now",
];

const shippingData = [
  "Pickup Only",
  "Shipping Local/Domestic Only (Country)",
  "Shipping International",
];

const conditionList = ["Mint", "Used", "N/A"];

import {
  countries,
  newTopics,
  stampColors,
  stampGrades,
  qualityData,
  stampFormatTypes,
} from "../../../constant/staticData";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

export const SalesTab = ({ navigation }) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const singleSheetRef = useRef();
  const filterSheetRef = useRef();
  const mulSelectionSheet = useRef();
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [salesList, setSalesList] = useState(null);
  const [currentList, setCurrentList] = useState(null);
  const [listChanged, setListChanged] = useState(false);

  const [page, setPage] = useState(1);
  const [endPage, setEndPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValues, setFilterValue] = useState(null);

  const staticTopics = Helper.deepCopy(newTopics)?.map(
    ({ value: key, ...rest }) => ({
      key,
      ...rest,
    })
  );

  let countryId = 1;
  const staticCountries = Helper.deepCopy(countries)?.map(
    ({ value: key, ...rest }) => ({
      key,
      ...rest,
      isSelected: false,
      id: countryId++,
    })
  );

  const [data, setData] = useState(null);
  const [title, setTitle] = useState(null);
  const [yearRange, setYearRange] = useState(null);
  const [sheetHeight, setSheetHeight] = useState(null);
  const [categoryList, setCategoryList] = useState(null);
  const [topicList, setTopicList] = useState(staticTopics);
  const [countriesData, setCountriesData] = useState(staticCountries);

  const colorList = stampColors?.map((item) => item.value);
  const gradeList = stampGrades?.map((item) => item.value);
  const qualityList = qualityData?.map((item) => item.key);
  const formatList = stampFormatTypes?.map((item) => item.value);

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
    await getSales();
    dispatch(allActions.DataAction.AppLoader(false));
  };

  const getSales = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`products`, `?productable_type=StampItem&is_published=2`)
    );
    const error = response?.response?.data;
    if (response?.status == 200) {
      const data = response?.data?.result?.paginated_items?.data;
      const endPage = response?.data?.result?.paginated_items?.last_page;
      setPage(1);
      setEndPage(endPage);
      setSalesList(data);
      setCurrentList(data);
    } else {
      Helper.showToastMessage(`${error?.message}`, colors.danger);
    }
  };

  const fetchMoreSales = async () => {
    if (page < endPage && salesList?.length >= 10) {
      setLoading(true);
      const response = await MindAxios.get(
        Env.paramUrl(
          `products`,
          `?productable_type=StampItem&is_published=2&page=${page + 1}`
        )
      );
      setLoading(false);
      const error = response?.response?.data;
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setPage(page + 1);
        setSalesList([...salesList, ..._data]);
        setCurrentList([...salesList, ..._data]);
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
    await getSales();
    resetFilterValues();
    setIsLoading(false);
  };

  const renderItem = ({ item, index }) => {
    return (
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
            if (item?.productable_type === "StampItem") {
              Helper.fbEvent("product_open_from_market");
              Helper.fbEvent("product_open_from_sale");
            } else {
              Helper.fbEvent("supply_open_from_market");
              Helper.fbEvent("supply_open_from_sale");
            }
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
  };

  const fetchCategories = async () => {
    const response = await MindAxios.get(
      Env.createUrl("categories/?type=stamp_items")
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

  const filterTopics = topicList?.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });
  const filterCountries = countriesData?.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });
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
    if (type == "Years") {
      setSheetHeight(hp(50));
      setTitle(type);
      setData(yearList);
      singleSheetRef?.current?.open();
    } else if (type == "Country") {
      setTitle(type);
      setSheetHeight(hp(94));
      setData(countriesData);
      mulSelectionSheet?.current?.open();
    } else if (type === "Topic") {
      setTitle("Topics");
      setData(topicList);
      setSheetHeight(hp(94));
      mulSelectionSheet?.current?.open();
    } else if (type === "Category") {
      setSheetHeight(hp(94));
      setTitle("Categories");
      setData(categoryList);
      mulSelectionSheet?.current?.open();
    } else if (type === "Shipping") {
      setTitle(type);
      setData(shippingData);
      setSheetHeight(hp(25));
      singleSheetRef?.current?.open();
    } else if (type === "Grade") {
      setTitle(type);
      setData(gradeList);
      setSheetHeight(hp(90));
      singleSheetRef?.current?.open();
    } else if (type === "Condition") {
      setTitle(type);
      setData(conditionList);
      setSheetHeight(hp(25));
      singleSheetRef?.current?.open();
    } else if (type === "Color") {
      setTitle(type);
      setData(colorList);
      setSheetHeight(hp(94));
      singleSheetRef?.current?.open();
    } else if (type === "Quality") {
      setTitle(type);
      setData(qualityList);
      setSheetHeight(hp(50));
      singleSheetRef?.current?.open();
    } else if (type === "Format") {
      setTitle(type);
      setData(formatList);
      setSheetHeight(hp(82));
      singleSheetRef?.current?.open();
    }
  };

  const itemCheck = (val, index) => {
    if (title == "Years") {
      setYearRange(val);
      if (index == 0) {
        const myVal = val.split(" ");
        let myValues = filterValues;
        delete myValues?.year_from;
        setFilterValue({ ...myValues, year_to: myVal[1].trim() });
      } else if (index == yearList?.length - 1) {
        const myVal = val.split("-");
        let myValues = filterValues;
        delete myValues?.year_to;
        setFilterValue({ ...myValues, year_from: myVal[0].trim() });
      } else {
        const myVal = val.split("-");
        setFilterValue({
          ...filterValues,
          year_to: myVal[1].trim(),
          year_from: myVal[0].trim(),
        });
      }
    } else if (title == "Shipping") {
      setFilterValue({ ...filterValues, shiping_option: `${val}` });
    } else if (title == "Grade") {
      setFilterValue({ ...filterValues, grade: `${val}` });
    } else if (title == "Color") {
      setFilterValue({ ...filterValues, color: `${val}` });
    } else if (title == "Condition") {
      setFilterValue({ ...filterValues, condition: `${val}` });
    } else if (title == "Quality") {
      setFilterValue({ ...filterValues, quality: `${val}` });
    } else if (title == "Format") {
      setFilterValue({ ...filterValues, format: `${val}` });
    }
  };

  const selectionChecker = (selected, index) => {
    if (title === "Country") {
      toggleItem(selected, index, countriesData, setCountriesData);
    } else if (title === "Topics") {
      toggleItem(selected, index, topicList, setTopicList);
    } else if (title === "Categories") {
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
          query = query.concat(`category_id[]=${item.id}`);
        } else {
          query = query.concat(`&category_id[]=${item.id}`);
        }
      });
    }
    if (filterCountries?.length) {
      filterCountries?.map((item, index) => {
        if (query?.length === 0) {
          query = query.concat(`country[]=${item.key}`);
        } else {
          query = query.concat(`&country[]=${item.key}`);
        }
      });
    }
    if (filterTopics?.length) {
      filterTopics?.map((item, index) => {
        if (query?.length === 0) {
          query = query.concat(`topic_id[]=${item.id}`);
        } else {
          query = query.concat(`&topic_id[]=${item.id}`);
        }
      });
    }
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(
        `products`,
        `?productable_type=StampItem&is_published=2&page_size=9&${query}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setSalesList(_data);
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
          `?productable_type=StampItem&is_published=2&page_size=9&search=${x}`
        )
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setSalesList(_data);
      }
    } else {
      setSalesList(currentList);
    }
  };

  const resetFilterValues = () => {
    setYearRange(null);
    setFilterValue(null);
    resetSelectedValues(topicList, setTopicList);
    resetSelectedValues(categoryList, setCategoryList);
    resetSelectedValues(countriesData, setCountriesData);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SearchComp
        onTermChange={(value) => searchItems(value)}
        onTermSubmit={(value) => searchItems(value)}
        onFilter={() => filterSheetRef?.current?.open()}
      />
      {salesList?.length ? (
        <FlatList
          numColumns={2}
          data={salesList}
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
          onEndReached={fetchMoreSales}
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
        sheetHeight={hp(82)}
        ChildComponent={
          <SaleFilterSheet
            filterType={"Sale"}
            yearRange={yearRange}
            filterValues={filterValues}
            filterTopics={filterTopics}
            setFilterValue={setFilterValue}
            filterCountries={filterCountries}
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
              setSalesList(currentList);
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
