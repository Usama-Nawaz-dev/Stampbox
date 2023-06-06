import React, { useState, useEffect, useRef, useContext } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";

import { styles } from "./styles";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { FilterSheet, ItemSheet } from "../../../Sheets";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { SimpleHeader, ItemCard, BottomSheet } from "../../../../components";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import {
  countries,
  stampCatalogNumberTypes,
} from "../../../../constant/staticData";
import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";

const year = [
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

export const Catalogue = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const filterSheetRef = useRef();
  const singleSheetRef = useRef();

  const [list, setList] = useState(null);
  const [country, setCountry] = useState();
  const [range, setRange] = useState();
  const [category, setCategory] = useState();
  const [catalogue, setCatalogue] = useState();
  const [data, setData] = useState(null);
  const [title, setTitle] = useState(null);
  const [sheetHeight, setSheetHeight] = useState(null);
  const [categoryList, setCategoryList] = useState(null);
  const [apiUrl, setAppiUrl] = useState(null);
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(false);

  // pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const countryList = countries?.map((item) => item.value);
  const catalogueList = stampCatalogNumberTypes?.map((item) => item?.value);

  const typeCheck = (type) => {
    if (type == "Years") {
      setSheetHeight(hp(50));
      setTitle(type);
      setData(year);
      singleSheetRef?.current?.open();
    } else if (type == "Country") {
      setSheetHeight(hp(94));
      setTitle(type);
      setData(countryList);
      singleSheetRef?.current?.open();
    } else if (type == "Category") {
      setSheetHeight(hp(94));
      setTitle(type);
      setData(categoryList);
      singleSheetRef?.current?.open();
    } else if (type == "Catalogue") {
      setTitle(type);
      setSheetHeight(hp(38));
      setData(catalogueList);
      singleSheetRef?.current?.open();
    }
  };

  const itemCheck = (val, index) => {
    if (title == "Years") {
      setRange(val);
      if (index == 0) {
        const myVal = val.split(" ");
        setAppiUrl(`&year_to=${myVal[1].trim()}`);
      } else if (index == year?.length - 1) {
        const myVal = val.split("-");
        setAppiUrl(`&year_from=${myVal[0].trim()}`);
      } else {
        const myVal = val.split("-");
        setAppiUrl(`&year_from=${myVal[0].trim()}&year_to=${myVal[1].trim()}`);
      }
    } else if (title == "Country") {
      setCountry(val);
    } else if (title == "Category") {
      setCategory(val);
    } else if (title == "Catalogue") {
      setCatalogue(val);
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

  useEffect(() => {
    if (focused) {
      getCatalogues();
      fetchCategories();
    }
  }, [focused]);

  const INTERVAL = 1500;
  const searchItems = debounce(
    (x) => {
      onSearchData(x);
    },
    INTERVAL,
    { leading: true, trailing: false, maxWait: INTERVAL }
  );

  const onSearchData = async (x) => {
    let text = x.toLowerCase();
    if (x) {
      setLoading(true);
      const response = await MindAxios.get(
        Env.createUrl(`stamp-items/?status=FOR_REFERENCE&search=${x}`)
      );
      // console.log("response", response?.data?.result?.paginated_items?.data);
      setLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setList(_data);
      }
    } else {
      setLoading(false);
      setList(listData);
    }
  };

  const getCatalogues = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl("stamp-items", `?status=FOR_REFERENCE`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      console.log("next>>>", nextPageUrl);
      setList(_data);
      setListData(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextApiUrl = async () => {
    if (nextApiUrl !== null && list.length >= 10) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&status=FOR_REFERENCE`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setList([...list, ..._data]);
        setListData([...listData, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setIsLoading(false);
        setNextApiUrl(null);
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
          color={theme?.theme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  const fetchCategories = async () => {
    const response = await MindAxios.get(
      Env.createUrl("categories/?type=stamp_items")
    );
    if (response?.status == 200) {
      const data = response?.data?.result?.categories;
      const newData = data.map((item) => item?.name);
      setCategoryList(data);
    }
  };

  const onApplyFilter = async () => {
    let url = "?status=FOR_REFERENCE";
    if (apiUrl) {
      url = url.concat(apiUrl);
    }
    if (country) {
      url = url.concat("&country=" + country);
    }
    if (category) {
      url = url.concat("&category_id=" + category?.id);
    }
    if (catalogue) {
      url = url.concat(`&catalogue_number={"type":"${catalogue}"}`);
      // body.status = catalogue
    }
    setLoading(true);
    const response = await MindAxios.get(Env.paramUrl("stamp-items", url));
    setLoading(false);
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setList(_data);
    } else {
      alert(language?.serverError);
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
          showBtn={true}
          onViewDetail={() => onPressDetail(item?.id)}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SimpleHeader
        title="Catalogues"
        showSearch={true}
        showFilter={true}
        onFilter={() => filterSheetRef?.current?.open()}
        onChangeValue={(text) => {
          searchItems(text);
        }}
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <View style={{ marginTop: loading ? 15 : 5 }}>
        {loading && <ActivityIndicator color={colors.color8} size="small" />}
      </View>
      {list?.length ? (
        <FlatList
          data={list}
          style={{ paddingHorizontal: wp(5) }}
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.4}
          onEndReached={getNextApiUrl}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={styles.itemText}>
            {language?.you_have_no_Item_listed}
          </AppText>
        </View>
      )}
      {/* Filter Sheet */}
      <BottomSheet
        ref={filterSheetRef}
        sheetHeight={hp(45)}
        ChildComponent={
          <FilterSheet
            range={range}
            country={country}
            category={category}
            catalogue={catalogue}
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
              setCatalogue(null);
              setCategory(null);
              setCountry(null);
              setAppiUrl(null);
              setRange(null);
              setList(listData);
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
    </View>
  );
};
