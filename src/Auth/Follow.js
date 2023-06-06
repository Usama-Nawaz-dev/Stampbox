import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";

import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import Helper from "../Helper";
import { useSelector, useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import AuthContext from "../Context/AuthContext";
import { FindUserCard } from "../../components";
import AppText from "../../components/AppText";
import { BoardingHeader, SearchFilter } from "../../components";
import colors from "../../constant/colors";
import ThemeContext from "../Context/ThemeContext";

export default function Follow({ navigation }) {
  const stars = [1, 2, 3, 4, 5];
  const [users, setUsers] = useState([]);
  const [userList, setUserList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listChnaged, setListChanged] = useState(true);
  const dispatch = useDispatch();
  const { signIn } = useContext(AuthContext);
  const { theme }= useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.get(
        Env.createUrl("users?page_size=100")
      );
      dispatch(allActions.DataAction.AppLoader(false));
      if (response?.status == 200) {
        let data = response?.data?.result?.users?.data;
        setUsers(data);
        setUserList(data);
      } else {
        alert("Unauthenticated");
      }
    })();
  }, []);

  //Follow User
  const followUser = async (item) => {
    const body = {
      target_user_id: item?.id,
    };
    // console.log(body)
    const response = await MindAxios.post(
      Env.createUrl("users/toggle-follow"),
      body
    );
    // console.log("res-->", response);
    if (response?.status == 200) {
      item.is_following_request_send = true;
      setListChanged(!listChnaged);
    } else {
      alert(language?.serverError);
    }
  };

  // Cancel Request
  const cancelRequest = async (item) => {
    const body = {
      target_user_id: item?.id,
    };
    // console.log(body)
    const response = await MindAxios.post(
      Env.createUrl("users/toggle-follow"),
      body
    );
    console.log("res-->", response);
    if (response?.status == 200) {
      item.is_following_request_send = false;
      setListChanged(!listChnaged);
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <FindUserCard
        User={item}
        onFollow={() => followUser(item)}
        onCancel={() => cancelRequest(item)}
      />
    );
  };

  const searchUser = async (x) => {
    if (x) {
      setLoading(true);
      const response = await MindAxios.get(
        Env.createUrl(`users?page_size=100&search=${x}`)
      );
      // console.log("response", response?.data?.result?.users?.data);
      setLoading(false);
      if (response?.status == 200) {
        setUsers(response?.data?.result?.users?.data);
      }
    } else {
      setUsers(userList);
    }
  };

  const onSkip = async () => {
    const token = await Helper.getData("loginToken");
    dispatch(allActions.DataAction.AppLoader(true));
    await Helper.storeData("homeToken", token);
    dispatch(allActions.DataAction.AppLoader(false));
    signIn(token);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <>
        <BoardingHeader
          onPressNext={onSkip}
          title="People"
          btnRight="NEXT"
          onPressBack={() => navigation.goBack()}
        />
        <SearchFilter
          showFilter={false}
          onTermChange={(text) => {
            searchUser(text);
          }}
          onTermSubmit={(text) => {
            searchUser(text);
          }}
        />
        <View>
          {loading && <ActivityIndicator color={colors.color8} size="small" />}
        </View>
        {users?.length ? (
          <FlatList
            data={users}
            renderItem={renderItem}
            extraData={listChnaged}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={styles.emptyList}>
            <AppText style={styles.emptyText}>{language?.noUserFound}</AppText>
          </View>
        )}
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.theme,
    fontWeight: "500",
  },
});
