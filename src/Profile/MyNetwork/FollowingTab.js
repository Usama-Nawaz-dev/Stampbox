import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import SearchBar from "../../../components/SearchBar";
import { images } from "../../../assets/images/Images";
import { BlogFollow, Followers } from "../../../components";

import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

import { createMaterialTopTabNavigator } from "../../../CustomPackages/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

export const FollowingTab = (props) => {
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="Follwers"
        tabBarOptions={{
          activeTintColor: theme?.theme,
          inactiveTintColor: theme?.lightText,
          labelStyle: styles.labelStyle,
        }}
        screenOptions={{
          //use this config
          tabBarIndicatorStyle: { backgroundColor: theme?.theme },
          tabBarStyle: {
            backgroundColor: theme?.white,
          },
        }}
      >
        <Tab.Screen
          name="Users"
          component={FollowingUser}
          options={{ tabBarLabel: language?.users }}
        />
        <Tab.Screen
          name="blogs"
          component={FollowingBlog}
          options={{ tabBarLabel: language?.blogs }}
        />
      </Tab.Navigator>
    </View>
  );
};

const FollowingUser = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const otherUser = useSelector((state) => state.DetailReducer.otherUser);

  const owner = currentUser?.id === otherUser?.id;
  const [followingList, setFollowingList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [listChnaged, setListChanged] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await getFollowing();
      })();
    }, [])
  );

  const getFollowing = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(
        `users`,
        `${
          otherUser ? otherUser?.id : currentUser?.id
        }/following?page_size=20&status=Accepted`
      )
    );
    setLoading(false);
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
        nextApiUrl + `&page_size=20&status=Accepted`
      );
      setIsLoading(false);
      // console.log("response", response?.data?.result?.users?.data);
      if (response?.status == 200) {
        let _data = response?.data?.result?.users?.data;
        setFollowingList([...followingList, ..._data]);
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

  // const userFollow = async (id) => {
  //     // setLoading(true);
  //     dispatch(allActions.DataAction.ActivityModal(true));
  //     let body = {
  //         target_user_id: id,
  //     };
  //     const response = await MindAxios.post(
  //         Env.createUrl("users/toggle-follow"),
  //         body
  //     );
  //     // console.log("res-->", response);
  //     dispatch(allActions.DataAction.ActivityModal(false));
  //     if (response?.status == 200) {
  //         let followed = followingList.map((item) => {
  //             if (item.following_id == id) {
  //                 if (item.following.is_current_user_following) {
  //                     item.following.is_current_user_following = false;
  //                 } else {
  //                     item.following.is_current_user_following = true;
  //                 }
  //             }
  //             return item;
  //         });
  //         setFollowingList(followed);
  //         setData(followed);
  //         // setLoading(false);
  //     } else { alert("Server Error.") }
  // };

  const toggleFollow = async () => {
    setModalVisible(false);
    let body = {
      target_user_id: selectedItem?.following_id,
    };
    console.log(selectedItem);
    const response = await MindAxios.post(
      Env.createUrl("users/toggle-follow"),
      body
    );
    // console.log(response)
    if (response?.status == 200) {
      // selectedItem.toggle = !selectedItem.toggle;
      // setListChanged(!listChnaged)
      const filterData = followingList.filter(
        (item) => item?.id !== selectedItem?.id
      );
      Helper.showToastMessage("User Unfollowed.", colors.green);
      setFollowingList(filterData);
      setData(filterData);
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

  const renderItem = ({ item, index }) => {
    // console.log('item-->', item)
    return (
      <Followers
        showBtn={owner}
        User={item?.following}
        btnTitle={item?.toggle ? language?.follow : language?.unfollow}
        onPressBtn={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
        onViewUser={() => {
          if (item?.following?.id === currentUser?.id) {
            props.navigation.navigate("MyProfile");
          } else {
            dispatch(allActions.DetailAction.OtherUser(item?.following));
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
      {followingList?.length ? (
        <FlatList
          data={followingList}
          renderItem={renderItem}
          extraData={listChnaged}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          onEndReached={getNextFollowing}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.userImg}
              source={
                selectedItem?.following?.image_url
                  ? { uri: selectedItem?.following?.image_url }
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
              onPress={() => setModalVisible(false)}
            >
              <AppText style={[styles.btnText, { color: colors.btnText }]}>
                {language?.cancel}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const FollowingBlog = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const otherUser = useSelector((state) => state.DetailReducer.otherUser);

  const [blogList, setBlogList] = useState(null);
  const [listChnaged, setListChanged] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await getBlog();
      })();
    }, [])
  );

  const getBlog = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.createUrl(
        `followable?user_id=${
          otherUser ? otherUser?.id : currentUser?.id
        }&page_size=10&followable_type=Blog`
      )
    );
    setLoading(false);
    if (response?.status == 200) {
      setBlogList(response?.data?.result?.paginated_items?.data);
      setData(response?.data?.result?.paginated_items?.data);
      setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url);
    } else {
      alert("Server error.");
    }
  };

  const getNextBlogs = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl +
          `&user_id=${
            otherUser ? otherUser?.id : currentUser?.id
          }&page_size=10&followable_type=Blog`
      );
      console.log(response?.status);
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        setBlogList([...data, ..._data]);
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
      let filteredName = blogList.filter((item) => {
        return item.followable.title.toLowerCase().match(text);
      });
      setBlogList(filteredName);
    } else {
      setBlogList(data);
    }
  };

  const renderItem = ({ item, index }) => {
    return <BlogFollow Item={item} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SearchBar
        placeholder={"Search for blog..."}
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
      {blogList?.length ? (
        <FlatList
          data={blogList}
          renderItem={renderItem}
          extraData={listChnaged}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          onEndReached={getNextBlogs}
        />
      ) : (
        <View style={styles.emptyList}>
          {loading ? (
            <ActivityIndicator size="large" color={theme?.theme} />
          ) : (
            <AppText style={styles.emptyText}>{"No data Found."}</AppText>
          )}
        </View>
      )}
    </View>
  );
};
