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

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import { OnlyUserCard, MainHeader } from "../../components";
import allActions from "../../redux/actions";
import AuthContext from "../Context/AuthContext";
import { getUsers, searchData, searchItems, toggle } from "./locals";
import { FadeInFlatList } from "../../components/FadeInFlatList";

export const Users = (props) => {
  const { navigation } = props;
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState(null);
  const [listChnaged, setListChanged] = useState(true);
  const [selectedList, setSelectedList] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused) {
      (async () => {
        getUsers(setUserList, setData, selectedList);
      })();
    }
  }, [focused]);

  const submit = () => {
    let selected = userList?.filter((obj) => obj.isSelected == true);
    // console.log("selected", selected);
    if (selected?.length) {
      selected.unshift(currentUser);
      dispatch(allActions.SheetAction.groupMembers(selected));
      navigation.navigate("CreateGroup");
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
              Submit
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
          searchItems(text, setLoading, setUserList, data, selectedList);
        }}
        onTermSubmit={(text) => {
          searchData(text, setLoading, setUserList, data, selectedList);
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
