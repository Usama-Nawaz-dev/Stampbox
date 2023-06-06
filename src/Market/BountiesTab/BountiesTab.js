import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { styles } from "./styles";
import { BountyCard } from "./BountyCard";
import colors from "../../../constant/colors";
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
import { BountyFilterSheet } from "../MarketSheets";

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

export const BountiesTab = ({ navigation }) => {
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
  const [bountiesList, setBountiesList] = useState(null);

  const [page, setPage] = useState(1);
  const [endPage, setEndPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValues, setFilterValue] = useState(null);

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

  const fetchData = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    await getBounties();
    dispatch(allActions.DataAction.AppLoader(false));
  };

  const getBounties = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`bounties`, `?status=Active`)
    );

    const error = response?.response?.data;
    if (response?.status == 200) {
      const data = response?.data?.result?.paginated_items?.data;
      const endPage = response?.data?.result?.paginated_items?.last_page;
      setPage(1);
      setEndPage(endPage);
      setBountiesList(data);
      setCurrentList(data);
    } else {
      Helper.showToastMessage(`${error?.message}`, colors.danger);
    }
  };

  const fetchMoreBounties = async () => {
    if (page < endPage && bountiesList?.length >= 10) {
      setLoading(true);
      const response = await MindAxios.get(
        Env.paramUrl(`bounties`, `?status=Active&page=${page + 1}`)
      );
      setLoading(false);
      const error = response?.response?.data;
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setPage(page + 1);
        setBountiesList([...bountiesList, ..._data]);
        setCurrentList([...bountiesList, ..._data]);
      } else {
        alert("Error", `${error?.message}`);
      }
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
    await getBounties();
    resetFilterValues();
    setIsLoading(false);
  };

  const renderItem = ({ item, index }) => (
    <View style={{ marginRight: wp(3), marginBottom: hp(1.5) }}>
      <BountyCard
        ItemDetail={item}
        onPressHunt={() => {
          dispatch(allActions.DetailAction.BountyDetail(item));
          navigation.navigate("BountyStack");
        }}
        onPressUser={() => {
          Helper.fbEvent("open_profile_from_market");
          // navigation.navigate("OtherUser", { user: item?.user });
          dispatch(allActions.DetailAction.OtherUser(item?.user));
          navigation.navigate("ProfileStack");
        }}
        gotoChat={() => {
          let name = item?.user?.full_name
            ? item?.user?.full_name
            : item?.user?.first_name;
          // console.log('item', item);
          item.type = item?.user?.id;
          item.from = name;
          item.message = item?.user?.image_url;
          dispatch(allActions.SheetAction.user_chat(item));
          navigation.navigate("ChatScreen", { item });
        }}
      />
    </View>
  );

  const filterCountries = countriesData?.filter((item) => {
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

    if (filterCountries?.length) {
      filterCountries?.map((item, index) => {
        if (query?.length === 0) {
          query = query.concat(`country[]=${item.key}`);
        } else {
          query = query.concat(`&country[]=${item.key}`);
        }
      });
    }

    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`bounties`, `?status=Active&page_size=9&${query}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setBountiesList(_data);
    } else {
      alert(language?.serverError);
    }
  };

  const resetSelectedValues = (data, setState) => {
    const listData = data.map((item, index) => {
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
        Env.paramUrl(`bounties`, `?status=Active&page_size=9&search=${x}`)
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setBountiesList(_data);
      }
    } else {
      setBountiesList(currentList);
    }
  };

  const resetFilterValues = () => {
    setYearRange(null);
    setFilterValue(null);
    resetSelectedValues(countriesData, setCountriesData);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SearchComp
        onTermChange={(value) => searchItems(value)}
        onTermSubmit={(value) => searchItems(value)}
        onFilter={() => filterSheetRef?.current?.open()}
      />
      {bountiesList?.length ? (
        <FlatList
          numColumns={2}
          data={bountiesList}
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
          onEndReached={fetchMoreBounties}
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
        sheetHeight={hp(55)}
        ChildComponent={
          <BountyFilterSheet
            yearRange={yearRange}
            filterValues={filterValues}
            filterCountries={filterCountries}
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
              setBountiesList(currentList);
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
