import React, { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Button,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import { EventReqCard } from "../../../components";
import SearchBar from "../../../components/SearchBar";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const EventRequests = ({ onPressUser }) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const eventDetail = useSelector((state) => state.DetailReducer.eventDetail);

  const [userList, setUserList] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listChanged, setListChanged] = useState(true);
  const { theme }= useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused) {
      fetchRequests();
    }
  }, [focused]);

  const fetchRequests = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.createUrl(
        `participants?event_id=${eventDetail?.id}&status=Pending&page_size=50`
      )
    );
    setLoading(false);
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const newData = _data?.map((item) => {
        item.loading1 = false;
        item.loading2 = false;
        return item;
      });
      setUserList(newData);
      setCurrentData(newData);
    } else {
      alert("Sever Error.");
    }
  };

  const searchData = (x) => {
    let text = x.toLowerCase();
    if (x) {
      let filteredName = userList?.filter((item) => {
        return item.user.full_name.toLowerCase().match(text);
      });
      setUserList(filteredName);
    } else {
      setUserList(currentData);
    }
  };

  const requestAction = async (status, item) => {
    if (status == "Accepted") {
      item.loading1 = !item.loading1;
      setListChanged(!listChanged);
    } else {
      item.loading2 = !item.loading2;
      setListChanged(!listChanged);
    }
    const body = { status: status };
    const response = await MindAxios.post(
      Env.paramUrl(`participants`, item?.id),
      body
    );
    if (response?.status === 200) {
      if (status == "Accepted") {
        item.loading1 = !item.loading1;
        setListChanged(!listChanged);
      } else {
        item.loading2 = !item.loading2;
        setListChanged(!listChanged);
      }
      const filterList = userList?.filter((data) => data?.id !== item?.id);
      setUserList(filterList);
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    // console.log('item-->', item)
    return (
      <EventReqCard
        Item={item}
        User={item?.user}
        invited={true}
        onPress={() => requestAction("Accepted", item)}
        onReject={() => requestAction("Rejected", item)}
        onPressDetail={() => onPressUser(item?.user)}
      />
    );
  };
  

  return (
    <View style={[styles.container, { backgroundColor: theme?.cardColor}]}>
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
      {userList?.length ? (
        <FlatList
          data={userList}
          renderItem={renderItem}
          extraData={listChanged}
          style={styles.listStyle}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyList}>
          {loading ? (
            <ActivityIndicator size="large" color={theme?.theme} />
          ) : (
            <AppText style={[styles.emptyText, { color: theme?.theme}]}>{language?.noUserFound}</AppText>
          )}
        </View>
      )}
    </View>
  );
};

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
  listStyle: {
    paddingTop: hp(1.5),
    paddingHorizontal: wp(3),
  },
});
