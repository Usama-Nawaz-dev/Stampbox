import React, { useState, useCallback, useContext } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";

import { styles } from "./styles";

import { Followers, RequestCard } from "../../../components";
import SearchBar from "../../../components/SearchBar";
import colors from "../../../constant/colors";

import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";
import Env from "../../../api/Env";
import Helper from "../../Helper";
import AppText from "../../../components/AppText";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from '../../../constant/colorsConfig';

export const SendTab = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [followingList, setFollowingList] = useState(null);
  const [listChnaged, setListChanged] = useState(true);
  const [data, setData] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await getFollowing();
      })();
    }, [])
  );
  const getFollowing = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(
        `users`,
        `${currentUser?.id}/following?page_size=20&status=Pending`
      )
    );
    // console.log("response", response?.data?.result?.users?.data);
    if (response?.status == 200) {
      setFollowingList(response?.data?.result?.users?.data);
      setData(response?.data?.result?.users?.data);
      setNextApiUrl(response?.data?.result?.users?.next_page_url);
    } else {
      alert("Server error.");
    }
  };

  const getNextFollowing = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&page_size=20&status=Pending`
      );
      setIsLoading(false);
      // console.log("response", response?.data?.result?.users?.data);
      if (response?.status == 200) {
        let _data = response?.data?.result?.users?.data;
        setFollowingList([...followingList, ..._data]);
        setData([...data, _data]);
        setNextApiUrl(response?.data?.result?.users?.next_page_url);
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

  const removeRequest = async (item) => {
    const body = {
      target_user_id: item?.following_id,
    };
    // console.log(body)
    const response = await MindAxios.post(
      Env.createUrl("users/toggle-follow"),
      body
    );
    // console.log("res-->", response);
    if (response?.status == 200) {
      item.toggle = !item.toggle;
      setListChanged(!listChnaged);
      // setLoading(false);
    } else {
      alert(language?.serverError);
    }
  };

  const searchData = (x) => {
    let text = x.toLowerCase();
    if (x) {
      let filteredName = followingList.filter((item) => {
        return item.following.full_name.toLowerCase().match(text);
      });
      setFollowingList(filteredName);
    } else {
      setFollowingList(data);
    }
  };

  // console.log(followingList)
  const renderItem = ({ item, index }) => {
    // console.log('item-->', item)
    return (
      <RequestCard
        showOther={true}
        User={item?.following}
        btnTitle={item?.toggle ? "Follow" : language?.cancel}
        onPressBtn={() => removeRequest(item)}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SearchBar
        placeholder={language?.searchForPeople + "..."}
        borderRadius={5}
        border={1}
        top={15}
        onTermChange={(text) => searchData(text)}
        onTermSubmit={(text) => searchData(text)}
      />
      {followingList?.length ? (
        <FlatList
          data={followingList}
          extraData={listChnaged}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          onEndReached={getNextFollowing}
        />
      ) : (
        <View style={styles.emptyList}>
          <AppText style={[styles.emptyText, { color: theme?.theme }]}>
            {language?.noUserFound}
          </AppText>
        </View>
      )}
    </View>
  );
};
