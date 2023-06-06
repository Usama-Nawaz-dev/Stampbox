import React, { useState, useCallback, useContext } from "react";
import { View, FlatList, Modal, Image, TouchableOpacity } from "react-native";

import { styles } from "./styles";

import { RequestCard } from "../../../components";
import SearchBar from "../../../components/SearchBar";
import AppText from "../../../components/AppText";
import colors from "../../../constant/colors";
import { images } from "../../../assets/images/Images";

import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";
import Env from "../../../api/Env";
import Helper from "../../Helper";

import {
  heightPercentageToDP as hp,
  heightPercentageToDP as wp,
} from "react-native-responsive-screen";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

export const RecievedTab = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [followerList, setFollowerList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState(null);
  const { theme }= useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await getFollowers();
      })();
    }, [])
  );
  const getFollowers = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(
        `users`,
        `${currentUser?.id}/followers?page_size=20&status=Pending`
      )
    );
    // console.log("response", response?.data?.result?.users?.data);
    if (response?.status == 200) {
      setFollowerList(response?.data?.result?.users?.data);
      setData(response?.data?.result?.users?.data);
    }
  };

  const onAccept = async () => {
    setModalVisible(false);
    const body = { status: "Accepted" };
    const response = await MindAxios.post(
      Env.paramUrl(`follows`, selectedItem?.id),
      body
    );
    if (response?.status == 200) {
      getFollowers();
      Helper.showToastMessage("Follower Request Accepted", colors.green);
    }
  };
  const onReject = async () => {
    setModalVisible(false);
    const response = await MindAxios.delete(
      Env.paramUrl(`follows`, selectedItem?.id)
    );
    // console.log(response)
    if (response?.status == 200) {
      getFollowers();
      Helper.showToastMessage("Follower Request Declined", colors.green);
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
    return (
      <RequestCard
        User={item?.follower}
        btnTitle={language?.followRequest}
        onPressBtn={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
      />
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme?.white}]}>
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
          style={{ marginTop: hp(2) }}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyList}>
          <AppText style={[styles.emptyText, { color: theme?.theme}]}>{language?.noUserFound}</AppText>
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
                selectedItem?.follower?.image_url
                  ? { uri: selectedItem?.follower?.image_url }
                  : images.placeholder
              }
            />
            <AppText style={styles.infoText}>
              <AppText style={styles.nameText}>
                {selectedItem?.follower?.full_name}{" "}
              </AppText>
              {language?.wants_to_be_your_follower}
              <AppText style={styles.nameText}>
                {" "}
                {selectedItem?.follower?.full_name}{" "}
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
                {language?.cancel}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
