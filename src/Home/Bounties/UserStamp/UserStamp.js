import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, ActivityIndicator, Alert } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import { SimpleHeader, SelectStamp, GradBtn } from "../../../../components";

import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import colors from "../../../../constant/colors";
import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";

export const UserStamp = (props) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [stampList, setStampList] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [type, setType] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getStamps();
      })();
    }
  }, [isFocused]);

  const getStamps = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`stamp-items`, `?user_id=${currentUser?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      // console.log("res --> stamps", _data);
      setStampList(_data);
      setCurrentData(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextApiUrl = async () => {
    if (nextApiUrl !== null && stampList.length >= 10) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${currentUser?.id}`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setStampList([...stampList, ..._data]);
        setCurrentData([...currentData, ..._data]);
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

  const searchData = (x) => {
    let text = x.toLowerCase();
    if (x) {
      let filteredStamp = stampList.filter((item) => {
        return item.name.toLowerCase().match(text);
      });
      setStampList(filteredStamp);
    } else {
      setStampList(currentData);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === stampList.length - 1;
    return (
      <View style={{ marginBottom: isEnd ? hp(2) : 0 }}>
        <SelectStamp
          ItemDetail={item}
          borderWidth={selectedId === item.id ? 2 : 0}
          onPress={() => {
            if (item?.is_attached_in_supply) {
              setSelectedItem(item);
              setSelectedId(item.id);
              setType("StampItem");
            } else {
              productAlert(item);
            }
          }}
        />
      </View>
    );
  };

  const productAlert = (item) =>
    Alert.alert(
      "Add Product ?",
      "In order to send stamp as offer, you must list item on for sale. ?",
      [{ text: "Cancel" }, { text: "ADD", onPress: () => onAddProduct(item) }]
    );

  const onAddProduct = async (item) => {
    dispatch(allActions.DetailAction.MyStamp(item));
    props.navigation.navigate("StoreStamp");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SimpleHeader
        showSearch={true}
        showFilter={false}
        title="Select Stamp"
        onChangeValue={(text) => searchData(text)}
        onPressBack={() => {
          props.navigation.goBack();
          dispatch(allActions.DetailAction.StampDetail([]));
        }}
      />
      <FlatList
        data={stampList}
        style={{ paddingHorizontal: wp(3), marginTop: hp(1.5) }}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={
          selectedId // for multiple items
        }
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.4}
        onEndReached={getNextApiUrl}
      />
      {selectedItem && (
        <View style={styles.bottomBtn}>
          <GradBtn
            label={language?.next}
            height={50}
            width={"90%"}
            style={{ marginTop: 0 }}
            onPress={() => {
              selectedItem["type"] = type;
              dispatch(allActions.DetailAction.StampDetail(selectedItem));
              props.navigation.goBack();
            }}
          />
        </View>
      )}
    </View>
  );
};
