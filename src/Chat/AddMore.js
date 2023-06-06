import React, { useState, useEffect, useContext } from "react";
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
import database from "@react-native-firebase/database";
import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import { SimpleHeader, OnlyUserCard, MainHeader } from "../../components";
import allActions from "../../redux/actions";
import AuthContext from "../Context/AuthContext";
import { FadeInFlatList } from "../../components/FadeInFlatList";
import { debounce } from "lodash";
import Helper from "../Helper";
import { getUsers, searchData, searchItems, toggle } from "./locals";

export const AddMore = (props) => {
  const { navigation } = props;
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const otherUser = useSelector((state) => state.SheetReducer.otherUser);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [listChnaged, setListChanged] = useState(true);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused) {
      (async () => {
        getUsers(setUserList, setData, selectedList, otherUser);
      })();
    }
  }, [focused]);

  const submit = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    let selected = userList?.filter((obj) => obj.isSelected == true);
    // console.log("selected", selected);
    if (selected?.length) {
      //   selected.unshift(currentUser);
      let now = Date.now();
      let newMembers = selected.map((obj) => {
        // let me = currentUser?.id == obj?.id;
        let newObj = {};
        newObj.id = obj?.id.toString();
        newObj.image = obj?.image_url;
        newObj.name = obj?.full_name;
        newObj.time = now.toString();
        newObj.type = "visitor";
        return newObj;
      });
      let merged = Helper.deepCopy([...otherUser.memberList, ...newMembers]);
      let createObj = { ...merged };
      console.log("createObj", createObj);
      await database()
        .ref(`/groups/${otherUser?.id}/memberList`)
        .update(createObj);
      dispatch(allActions.DataAction.AppLoader(false));
      let newItem = Helper.deepCopy(otherUser);
      newItem.memberList = merged;
      dispatch(allActions.SheetAction.user_chat(newItem));
      Helper.showToastMessage("Added successfully", colors.green);
      //   dispatch(allActions.SheetAction.groupMembers(selected));
      navigation.goBack();
    } else {
      alert("Please select any user to create group!");
    }
  };

  const renderItem = ({ item, index }) => {
    // console.log("item-->", index, userList?.length);
    const isEnd = index === data?.length - 1;
    return (
      <OnlyUserCard
        isEnd={isEnd}
        index={index}
        User={item}
        onValueChange={(selected, index) =>
          toggle(selected, index, userList, setUserList, setSelectedList)
        }
        otherIcon={true}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="Add User"
        onPressBack={() => {
          setSelectedList(null);
          dispatch(allActions.SheetAction.groupMembers([]));
          navigation.goBack();
        }}
        rightIcon={
          <TouchableOpacity onPress={submit}>
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 18 }}>
              Add
            </Text>
          </TouchableOpacity>
        }
      />
      <SearchBar
        placeholder={"Search for people..."}
        borderRadius={5}
        border={1}
        top={15}
        onTermChange={(text) => {
          searchItems(
            text,
            setLoading,
            setUserList,
            data,
            selectedList,
            otherUser
          );
        }}
        onTermSubmit={(text) => {
          searchData(
            text,
            setLoading,
            setUserList,
            data,
            selectedList,
            otherUser
          );
        }}
      />
      <View style={{ marginTop: loading ? 15 : 5 }}>
        {loading && <ActivityIndicator color={colors.color8} size="small" />}
      </View>
      {userList?.length ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={userList}
          extraData={listChnaged}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyList}>
          <AppText style={styles.emptyText}>{language?.noUserFound}</AppText>
        </View>
      )}
    </View>
  );
};
