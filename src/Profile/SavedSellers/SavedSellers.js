import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";

import { styles } from "./styles";
import AppText from "../../../components/AppText";
import SearchBar from "../../../components/SearchBar";
import { Followers, MainHeader } from "../../../components";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const SavedSellers = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sellersList, setSellerList] = useState(null);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (focused) {
      fetchSellers();
    }
  }, [focused]);

  const fetchSellers = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(
        `bookmarks`,
        `?book_markable_type=user&user_id=${currentUser?.id}`
      )
    );
    setLoading(false);
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setData(_data);
      setSellerList(_data);
      setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url);
    } else {
      alert("Server error.");
    }
  };

  const loadMoreSellers = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&book_markable_type=user&user_id=${currentUser?.id}`
      );
      setIsLoading(false);
      // console.log("response", response?.data?.result?.users?.data);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setSellerList([...data, ..._data]);
        setData([...data, ..._data]);
        setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url);
      } else {
        setNextApiUrl(null);
        alert("Server error.");
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

  const searchData = (x) => {
    let text = x.toLowerCase();
    if (x) {
      let filteredName = sellersList.filter((item) => {
        return item.book_markable.full_name.toLowerCase().match(text);
      });
      setSellerList(filteredName);
    } else {
      setSellerList(data);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <Followers
        showBtn={false}
        User={item?.book_markable}
        onViewUser={() => {
          dispatch(allActions.DetailAction.OtherUser(item?.book_markable));
          props.navigation.navigate("UserProfile");
        }}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={"My Saved Sellers"}
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <SearchBar
        placeholder={"Search for sellers..."}
        borderRadius={5}
        border={1}
        top={15}
        onTermChange={(text) => {
          searchData(text);
        }}
        onTermSubmit={(text) => {
          searchData(text);
        }}
      />
      {sellersList?.length ? (
        <FlatList
          data={sellersList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          onEndReached={loadMoreSellers}
        />
      ) : (
        <View style={styles.emptyList}>
          {loading ? (
            <ActivityIndicator size="large" color={theme?.theme} />
          ) : (
            <AppText style={styles.emptyText}>{language?.noUserFound}</AppText>
          )}
        </View>
      )}
    </View>
  );
};
