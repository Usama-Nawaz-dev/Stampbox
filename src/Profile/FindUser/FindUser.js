import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import { SearchFilter } from "../../../components";
import { UserSearchSheet } from "./UserSearchSheet";
import { images } from "../../../assets/images/Images";
import { MainHeader, FindUserCard, BottomSheet } from "../../../components";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const FindUser = (props) => {
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const searchSheetRef = useRef();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listChnaged, setListChanged] = useState(true);
  const [followModal, setFollowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [filterValues, setFilterValue] = useState(null);
  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused) {
      (async () => {
        await getUsers();
      })();
    }
  }, [focused]);

  //Fetch All Users Api
  const getUsers = async () => {
    setIsLoading(true);
    const response = await MindAxios.get(Env.createUrl(`users?page_size=20`));
    setIsLoading(false);
    // console.log("response", response);
    if (response?.status == 200) {
      setUserList(response?.data?.result?.users?.data);
      setData(response?.data?.result?.users?.data);
      setNextApiUrl(response?.data?.result?.users?.next_page_url);
    } else {
      alert("Server Error");
    }
  };

  const getNextUsers = async () => {
    if (nextApiUrl !== null && userList?.length >= 20) {
      setIsPageLoading(true);
      const response = await MindAxios.get(nextApiUrl + `&page_size=20`);
      setIsPageLoading(false);
      // console.log("response", response);
      if (response?.status == 200) {
        let _data = response?.data?.result?.users?.data;
        setUserList([...userList, ...data]);
        setData([...data, ..._data]);
        setNextApiUrl(response?.data?.result?.users?.next_page_url);
      } else {
        setNextApiUrl(null);
        alert("Server Error");
      }
    }
  };

  const renderFooter = () => {
    return isPageLoading ? (
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
    // console.log("res-->", response);
    if (response?.status == 200) {
      item.is_following_request_send = false;
      setListChanged(!listChnaged);
    } else {
      alert(language?.serverError);
    }
  };

  // Toggle Following
  const toggleFollow = async () => {
    setFollowModal(false);
    let body = {
      target_user_id: selectedUser?.id,
    };
    // console.log(selectedItem)
    const response = await MindAxios.post(
      Env.createUrl("users/toggle-follow"),
      body
    );
    // console.log(response)
    if (response?.status == 200) {
      const filterData = userList.map((item) => {
        if (item.id === selectedUser.id) {
          item.is_current_user_following = false;
          return item;
        } else {
          return item;
        }
      });
      setUserList(filterData);
      setData(filterData);
    } else {
      alert(language?.serverError);
    }
  };

  // On Accept Request
  const onAccept = async () => {
    setModalVisible(false);
    const body = { status: "Accepted" };
    const response = await MindAxios.post(
      Env.paramUrl(`follows`, selectedUser?.following[0]?.follower_id),
      body
    );
    // console.log("Request Accept Response.", response)
    if (response?.status == 200) {
      const filterData = userList.map((item) => {
        if (item.id === selectedUser.id) {
          item.is_follower_request_received = false;
          return item;
        } else {
          return item;
        }
      });
      setUserList(filterData);
      setData(filterData);
    } else {
      alert(language?.serverError);
    }
  };

  //On Reject Request
  const onReject = async () => {
    setModalVisible(false);
    const response = await MindAxios.delete(
      Env.paramUrl(`follows`, selectedUser?.following[0]?.follower_id)
    );
    // console.log("Decline Request", response);
    if (response?.status == 200) {
      const filterData = userList.map((item) => {
        if (item.id === selectedUser.id) {
          item.is_follower_request_received = false;
          return item;
        } else {
          return item;
        }
      });
      setUserList(filterData);
      setData(filterData);
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    // console.log('item-->', item)
    const followReq =
      item?.follower?.is_current_user_following ===
      item?.follower?.is_following_request_send;
    return (
      <FindUserCard
        User={item}
        onFollow={() => followUser(item)}
        onFollowing={() => {
          setSelectedUser(item);
          setFollowModal(true);
        }}
        onCancel={() => cancelRequest(item)}
        onPressBtn={() => {
          setSelectedUser(item);
          setModalVisible(true);
        }}
        onViewUser={() => {
          dispatch(allActions.DetailAction.OtherUser(item));
          props.navigation.navigate("UserProfile");
        }}
      />
    );
  };

  //User Filters
  const onApplyFilter = async () => {
    let query = "";
    if (filterValues !== null) {
      query = Object.keys(filterValues)
        .map((k) => {
          if (Array.isArray(filterValues[k])) {
            return filterValues[k].map((val) => `${k}=${val}`).join("&");
          }
          return `${k}=${filterValues[k]}`;
        })
        .join("&");
    }

    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(`users?page_size=30&${query}`)
    );
    // console.log(response);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.users?.data;
      setUserList(_data);
    } else {
      alert(language?.serverError);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title="Find People"
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={{ marginTop: hp(1) }}>
        <SearchFilter
          placeholder={language?.searchForPeople + "..."}
          onFilter={() => searchSheetRef?.current?.open()}
          onTermChange={(text) => {
            searchData(text);
          }}
          onTermSubmit={(text) => {
            searchData(text);
          }}
        />
      </View>
      <View style={{ marginTop: loading ? hp(1.5) : hp(0.5) }}>
        {loading && <ActivityIndicator color={colors.color8} size="small" />}
      </View>
      {userList?.length ? (
        <FlatList
          data={userList}
          extraData={listChnaged}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={getNextUsers}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.emptyList}>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme?.theme} />
          ) : (
            <AppText style={[styles.emptyText, { color: theme?.theme }]}>
              {language?.noUserFound}
            </AppText>
          )}
        </View>
      )}

      {/* Request Response Model */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setSelectedUser(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.userImg}
              source={
                selectedUser?.image_url
                  ? { uri: selectedUser.image_url }
                  : images.placeholder
              }
            />
            <AppText style={styles.infoText}>
              <AppText style={styles.nameText}>
                {selectedUser?.full_name}{" "}
              </AppText>
              {language?.wants_to_be_your_follower}
              <AppText style={styles.nameText}>
                {" "}
                {selectedUser?.full_name}{" "}
              </AppText>
              {language?.will_be_able_to_see}
            </AppText>
            <TouchableOpacity style={styles.button} onPress={onAccept}>
              <AppText style={styles.btnText}>
                {language?.acceptRequest}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onReject}>
              <AppText style={[styles.btnText, { color: colors.red }]}>
                {language?.declineRequest}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <AppText style={[styles.btnText, { color: colors.btnText }]}>
                Cancel
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Following Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={followModal}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setFollowModal(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.userImg}
              source={
                selectedUser?.image_url
                  ? { uri: selectedUser?.image_url }
                  : images.placeholder
              }
            />
            <AppText style={[styles.infoText, { fontWeight: "500" }]}>
              {language?.ifYouChangeMind}
            </AppText>
            <TouchableOpacity style={styles.button} onPress={toggleFollow}>
              <AppText style={[styles.btnText, { color: colors.lightTheme }]}>
                {language?.unfollow}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setFollowModal(false)}
            >
              <AppText style={[styles.btnText, { color: colors.btnText }]}>
                Cancel
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filter Sheet */}
      <BottomSheet
        ref={searchSheetRef}
        sheetHeight={hp(40)}
        ChildComponent={
          <UserSearchSheet
            filterValues={filterValues}
            setFilterValue={setFilterValue}
            onApplyFilter={() => {
              searchSheetRef?.current?.close();
              onApplyFilter();
            }}
            onReset={() => {
              searchSheetRef?.current?.close();
              setFilterValue(null);
              setUserList(data);
            }}
          />
        }
      />
    </View>
  );
};
