import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";

import { styles } from "./styles";

import { Followers } from "../../../components";
import SearchBar from "../../../components/SearchBar";
import AppText from "../../../components/AppText";
import colors from "../../../constant/colors";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";
import Env from "../../../api/Env";
import Helper from "../../Helper";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from '../../../constant/colorsConfig';

export const FollowerTab = (props) => {
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const otherUser = useSelector((state) => state.DetailReducer.otherUser);

  const owner = currentUser?.id === otherUser?.id;
  const [followerList, setFollowerList] = useState(null);
  const [listChnaged, setListChanged] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const { theme } = useContext(ThemeContext);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (focused) {
      (async () => {
        await getFollowers();
      })();
    }
  }, [focused]);

  const getFollowers = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(
        `users`,
        `${
          otherUser ? otherUser?.id : currentUser?.id
        }/followers?page_size=20&status=Accepted`
      )
    );
    setLoading(false);
    // console.log("response", response?.data?.result?.users?.next_page_url);
    if (response?.status == 200) {
      setFollowerList(response?.data?.result?.users?.data);
      setData(response?.data?.result?.users?.data);
      setNextApiUrl(response?.data?.result?.users?.next_page_url);
    } else {
      alert("Server error.");
    }
  };

  const getNextFollowers = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&page_size=20&status=Accepted`
      );
      setIsLoading(false);
      // console.log("response", response?.data?.result?.users?.next_page_url);
      if (response?.status == 200) {
        let _data = response?.data?.result?.users?.data;
        setFollowerList([...followerList, ..._data]);
        setData([...data, ..._data]);
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

  const userFollow = async (item) => {
    let body = {
      target_user_id: item?.follower_id,
    };
    const response = await MindAxios.post(
      Env.createUrl("users/toggle-follow"),
      body
    );
    // console.log("res-->", response);
    if (response?.status == 200) {
      item.toggle = !item.toggle;
      setListChanged(!listChnaged);
      Helper.showToastMessage("Follow request sent sccessfully", colors.green);
    } else {
      alert(language?.serverError);
    }
  };

  const onRemoveUser = async (item) => {
    // console.log(item)
    const response = await MindAxios.delete(Env.paramUrl(`follows`, item?.id));
    // console.log(response)
    if (response?.status === 200) {
      const filterData = followerList?.filter((val) => val?.id !== item?.id);
      Helper.showToastMessage("Follower Removed Successfully", colors.green);
      setFollowerList(filterData);
      setData(filterData);
    } else {
      alert(language?.serverError);
    }
  };

  const searchData = (x) => {
    let text = x.toLowerCase();
    if (x) {
      let filteredName = followerList.filter((item) => {
        return item.follower.full_name.toLowerCase().match(text);
      });
      setFollowerList(filteredName);
    } else {
      setFollowerList(data);
    }
  };

  const renderItem = ({ item, index }) => {
    // console.log('item-->', item)
    const followReq =
      item?.follower?.is_current_user_following ===
      item?.follower?.is_following_request_send;
    return (
      <Followers
        User={item?.follower}
        showBtn={owner}
        showMulti={followReq && !item?.toggle}
        onFollow={() => userFollow(item)}
        onPressBtn={() => onRemoveUser(item)}
        onViewUser={() => {
          if (item?.follower?.id === currentUser?.id) {
            props.navigation.navigate("MyProfile");
          } else {
            dispatch(allActions.DetailAction.OtherUser(item?.follower));
            props.navigation.navigate("UserProfile");
          }
        }}
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
        onTermChange={(text) => {
          searchData(text);
        }}
        onTermSubmit={(text) => {
          searchData(text);
        }}
      />
      {followerList?.length ? (
        <FlatList
          data={followerList}
          extraData={listChnaged}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={getNextFollowers}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.emptyList}>
          {loading ? (
            <ActivityIndicator size="large" color={theme?.theme} />
          ) : (
            <AppText style={[styles.emptyText, { color: theme?.theme }]}>
              {language?.noUserFound}
            </AppText>
          )}
        </View>
      )}
    </View>
  );
};
