import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";

import { styles } from "./styles";
import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import SearchBar from "../../components/SearchBar";
import { images } from "../../assets/images/Images";
// import { SimpleHeader, FindUserCard } from '../../../components'

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import { OnlyUserCard, MainHeader } from "../../components";
import allActions from "../../redux/actions";
import { debounce } from "lodash";

export const OnlyUsers = (props) => {
  const { navigation } = props;
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState(null);
  const [listChnaged, setListChanged] = useState(true);

  useEffect(() => {
    if (focused) {
      (async () => {
        await getUsers();
      })();
    }
  }, [focused]);
  const getUsers = async () => {
    const body = { page_size: 100 };
    const response = await MindAxios.get(Env.createUrl(`users?page_size=100`));
    // console.log("response", response?.data?.result?.users?.data);
    if (response?.status == 200) {
      let data = response?.data?.result?.users?.data;
      data?.forEach((obj) => (obj.isSelected = false));
      setUserList(data);
      setData(data);
    }
  };
  const INTERVAL = 1500;
  const searchItems = debounce(
    (x) => {
      searchData(x);
    },
    INTERVAL,
    { leading: true, trailing: false, maxWait: INTERVAL }
  );
  const searchData = async (x) => {
    let text = x.toLowerCase();
    if (x) {
      setLoading(true);
      const response = await MindAxios.get(
        Env.createUrl(`users?page_size=100&search=${x}`)
      );
      // console.log("response", response?.data?.result?.users?.data);
      setLoading(false);
      if (response?.status == 200) {
        setUserList(response?.data?.result?.users?.data);
      }
    } else {
      setUserList(data);
    }
  };

  const renderItem = ({ item, index }) => {
    // console.log('item-->', item)
    const isEnd = index === data?.length - 1;
    return (
      <OnlyUserCard
        isEnd={isEnd}
        index={index}
        User={item}
        otherIcon={false}
        onPress={() => {
          let name = item?.full_name ? item?.full_name : item?.first_name;
          let newItem = {};
          newItem.type = item?.id;
          newItem.from = name;
          newItem.message = item?.image_url;
          console.log("item", newItem);
          dispatch(allActions.SheetAction.user_chat(newItem));
          navigation.navigate("ChatScreen");
          //   navigation.reset({ index: 0, routes: [{ name: "ChatScreen" }] });
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="Users"
        onPressBack={() => {
          dispatch(allActions.SheetAction.groupMembers([]));
          navigation.goBack();
        }}
        // rightIcon={
        //   <TouchableOpacity onPress={submit}>
        //     <Text style={{ color: "#fff", fontWeight: "600", fontSize: 18 }}>
        //       Submit
        //     </Text>
        //   </TouchableOpacity>
        // }
      />
      <SearchBar
        placeholder={"Search for people..."}
        borderRadius={5}
        border={1}
        top={15}
        onTermChange={(text) => {
          searchItems(text);
        }}
        onTermSubmit={(text) => {
          searchData(text);
        }}
      />
      <View style={{ marginTop: loading ? 15 : 5 }}>
        {loading && <ActivityIndicator color={colors.color8} size="small" />}
      </View>
      {userList?.length ? (
        <FlatList
          data={userList}
          extraData={listChnaged}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyList}>
          <AppText style={styles.emptyText}>No User Found.</AppText>
        </View>
      )}
    </View>
  );
};
