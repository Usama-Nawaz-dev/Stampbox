import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import colors from "../../../../constant/colors";
import { MainHeader, Followers } from "../../../../components";
import SearchBar from "../../../../components/SearchBar";
import AppText from "../../../../components/AppText";
import AuthContext from "../../../Context/AuthContext";
import { images } from "../../../../assets/images/Images";

import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";

export function UnfollowedUsers(props) {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const otherUser = useSelector((state) => state.DetailReducer.otherUser);

  const owner = currentUser?.id === otherUser?.id;
  const [followingList, setFollowingList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [listChnaged, setListChanged] = useState(true);
  const [loading, setLoading] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme }= useContext(ThemeContext);

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
      Env.paramUrl(`users`, `${currentUser?.id}/following?status=Unfollowed`)
    );
    setLoading(false);
    if (response?.status == 200) {
      let userData = response?.data?.result?.users?.data;
      setFollowingList(userData);
    }
  };
  const searchUnfollowedUser = async (text) => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(
        `users`,
        `${currentUser?.id}/following?search=${text}&status=Unfollowed`
      )
    );
    setLoading(false);
    console.log("response,,,,,,.,,?", response);
    console.log("response", response?.data?.result?.users?.data);
    if (response?.status == 200) {
      // let userData = response?.data?.result?.users?.data;
      // setFollowingList(userData);
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
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title="Unfollowed Users"
        onPressBack={() => props.navigation.goBack()}
      />
      <SearchBar
        placeholder={language?.searchForPeople + "..."}
        borderRadius={5}
        border={1}
        top={15}
        onTermChange={(text) => {
          searchUnfollowedUser(text);
        }}
        onTermSubmit={(text) => {
          searchUnfollowedUser(text);
        }}
      />
      {followingList?.length ? (
        <FlatList
          data={followingList}
          renderItem={renderItem}
          extraData={listChnaged}
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
            <TouchableOpacity style={styles.button}>
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
      <View style={styles.content}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  content: {
    padding: 12,
  },
  labelStyle: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    paddingHorizontal: 5,
    textTransform: "none",
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

  //Request Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: wp(80),
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
  },
  button: {
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.borderColor,
  },
  btnText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
    paddingVertical: hp(1),
  },
  userImg: {
    height: 80,
    width: 80,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: colors.borderColor,
  },
  infoText: {
    fontSize: 11,
    maxWidth: wp(65),
    textAlign: "center",
    color: colors.heading,
    marginTop: hp(2),
    marginBottom: hp(1.5),
    paddingHorizontal: wp(2),
  },
  nameText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.heading,
  },
});
