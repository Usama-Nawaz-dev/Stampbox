import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import { ClubMemberCard } from "../../../../../components";
import SearchBar from "../../../../../components/SearchBar";

import Entypo from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import AuthContext from "../../../../Context/AuthContext";

export const MemberTab = () => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const clubDetail = useSelector((state) => state.DetailReducer.clubDetail);

  const [userList, setUserList] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listChanged, setListChanged] = useState(true);
  const [memberModal, setMemberModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused) {
      fetchClubMembers();
    }
  }, [focused]);

  const fetchClubMembers = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.createUrl(
        `club-members?club_id=${clubDetail?.id}&status=Accepted&page_size=20`
      )
    );
    setLoading(false);
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setUserList(_data);
      setCurrentData(_data);
    } else {
      alert("Sever Error.");
    }
  };

  const searchData = (x) => {
    let text = x.toLowerCase();
    if (x) {
      let filteredName = userList.filter((item) => {
        return item.user.full_name.toLowerCase().match(text);
      });
      setUserList(filteredName);
    } else {
      setUserList(currentData);
    }
  };

  const renderItem = ({ item, index }) => {
    // console.log('item-->', item)
    return (
      <ClubMemberCard
        Item={item}
        User={item?.user}
        onPress={() => {
          setSelectedUser(item);
          setMemberModal(true);
        }}
      />
    );
  };

  //Member Action Api's
  const adminAction = async () => {
    const body = {
      status: "Accepted",
      type: selectedUser?.type === "admin" ? "member" : "admin",
    };
    const response = await MindAxios.post(
      Env.paramUrl(`club-members`, selectedUser?.id),
      body
    );
    if (response?.status === 200) {
      const filterItem = userList.map((item) => {
        if (item?.id === selectedUser?.id) {
          item.type = item?.type === "admin" ? "member" : "admin";
          return item;
        } else {
          return item;
        }
      });
      setUserList(filterItem);
    } else {
      alert(language?.serverError);
    }
  };
  const removeMember = async () => {
    const response = await MindAxios.delete(
      Env.paramUrl(`club-members`, selectedUser?.id)
    );
    setMemberModal(false);
    if (response?.status === 200) {
      const filterItem = userList.filter(
        (item) => item?.id !== selectedUser?.id
      );
      setUserList(filterItem);
    } else {
      alert(language?.serverError);
    }
  };
  const blockMember = async () => {
    const body = { status: "Blocked" };
    const response = await MindAxios.post(
      Env.paramUrl(`club-members`, selectedUser?.id),
      body
    );
    setMemberModal(false);
    if (response?.status === 200) {
      const filterItem = userList.filter(
        (item) => item?.id !== selectedUser?.id
      );
      setUserList(filterItem);
    } else {
      alert(language?.serverError);
    }
  };

  return (
    <View style={styles.container}>
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
            <ActivityIndicator size="large" color={colors.theme} />
          ) : (
            <AppText style={styles.text}>{language?.noUserFound}</AppText>
          )}
        </View>
      )}

      {/* Member Action Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={memberModal}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setMemberModal(!memberModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.userImg}
              source={{ uri: selectedUser?.user?.image_url }}
            />
            <AppText style={styles.infoText}>
              {selectedUser?.user?.full_name}
            </AppText>
            <TouchableOpacity style={styles.button} onPress={adminAction}>
              <Entypo name="user" size={20} color={colors.heading} />
              <AppText style={styles.btnText}>
                {selectedUser?.type === "admin" ? "Make Member" : "Make Admin"}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={blockMember}>
              <Entypo name="remove-user" size={20} color={colors.red} />
              <AppText style={styles.btnText}>Block Member</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={removeMember}>
              <Entypo name="remove-user" size={20} color={colors.lightText} />
              <AppText style={styles.btnText}>Remove Member</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setMemberModal(false)}
            >
              <AppText style={[styles.btnText, { color: colors.btnText }]}>
                Cancel
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginTop: hp(1.5),
    paddingHorizontal: wp(3),
  },

  //Member Modal
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
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.borderColor,
  },
  btnText: {
    fontSize: 12,
    marginLeft: 5,
    fontWeight: "500",
    paddingVertical: hp(1),
    color: colors.lightTheme,
  },
  userImg: {
    height: 80,
    width: 80,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: colors.borderColor,
  },
  infoText: {
    fontSize: 16,
    maxWidth: wp(65),
    marginTop: hp(2),
    fontWeight: "500",
    textAlign: "center",
    color: colors.heading,
    marginBottom: hp(1.5),
    paddingHorizontal: wp(2),
  },
  nameText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.heading,
  },
});
