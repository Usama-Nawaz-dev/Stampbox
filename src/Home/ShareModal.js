import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  Modal,
  Alert,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useIsFocused } from "@react-navigation/native";

import Entypo from "react-native-vector-icons/Entypo";
import CheckBox from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

import colors from "../../constant/colors";
import { placeHolder } from "../../constant/Paths";

import Helper from "../Helper";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";

import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";

const ShareModal = (props) => {
  const {
    from,
    userId,
    selected,
    setSelected,
    selectedItem,
    modalVisible,
    setShareModalVisible,
  } = props;
  const focused = useIsFocused();

  const [clubs, setClubs] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      if (!clubs?.length) {
        await fetchClubs();
      }
    })();
  }, [selectedItem?.id]);

  const fetchClubs = async () => {
    setLoader(true);
    const res = await MindAxios.get(
      Env.createUrl(
        `clubs?club_type=JOINED_CLUBS&joined_club=${userId}&page_size=50`
      )
    );
    setLoader(false);
    if (res?.status == 200) {
      const _data = res?.data?.result?.paginated_items?.data;
      setClubs(_data);
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.userCard}>
        <TouchableOpacity
          onPress={() => {
            if (selected == item?.id) {
              setSelected(null);
            } else {
              setSelected(item?.id);
            }
          }}
          style={styles.check}
        >
          {selected == item?.id ? (
            <CheckBox name="checkbox" color={colors.lightTheme} size={25} />
          ) : (
            <View style={[styles.uncheck, { borderColor: theme?.lightText }]} />
          )}
        </TouchableOpacity>

        <View style={styles.cardBox}>
          <Image
            style={styles.userImg}
            source={item?.image_url ? { uri: item?.image_url } : placeHolder}
          />
          <View style={{ marginLeft: 8 }}>
            <Text
              numberOfLines={1}
              style={{ width: 85, fontSize: 12, color: theme?.black }}
            >
              {item?.name}
            </Text>
            <View style={styles.subTitle}>
              <FontAwesome
                name={item?.privacy_type == "Private" ? "shield-alt" : "globe"}
                color="grey"
                size={11}
              />
              <Text style={{ fontSize: 11, color: theme?.black }}>
                {item?.privacy_type}
              </Text>
              <Icon name="groups" color="grey" size={15} />
            </View>
          </View>
        </View>
      </View>
    );
  };
  const share = async () => {
    setLoading(true);
    let body = {
      club_id: selected,
      club_feed_type: from ? from : selectedItem?.feedable_type,
      club_feed_id: from ? selectedItem?.id : selectedItem?.feedable_id,
    };
    // console.log("body", body);
    const res = await MindAxios.post(Env.createUrl("club-feeds"), body);
    setLoading(false);
    console.log("res", res);
    if (res?.status == 200) {
      console.log("success", res);
      Helper.showToastMessage("Club Feed Created successfully", "green");
      setShareModalVisible(false);
    } else {
      Helper.showToastMessage("Something went wrong", "red");
    }
  };
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert(language?.modal_has_been_closed);
        // setModalVisible(!modalVisible);
        // dispatch(allActions.DataAction.ActivityModal(!modalVisible));
      }}
    >
      <View style={styles.centeredView}>
        <View style={[styles.container, { backgroundColor: theme?.cardColor }]}>
          <Pressable
            onPress={() => setShareModalVisible(false)}
            style={styles.cross}
          >
            <Entypo name="cross" color="#000" size={30} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <View style={styles.body}>
              <View
                style={{
                  height: 30,
                  width: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <Text style={styles.title}>Share in clubs</Text>
              </View>
              {!loader ? (
                <>
                  {clubs?.length ? (
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      style={{
                        alignSelf: clubs?.length == 1 ? "flex-start" : "center",
                        marginTop: 10,
                      }}
                      numColumns={2}
                      data={clubs}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  ) : (
                    <View style={styles.loader}>
                      <Text>No Clubs</Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" color={colors.lightTheme} />
                </View>
              )}
            </View>
            <View style={styles.footer}>
              {selected ? (
                <TouchableOpacity onPress={share} style={styles.shareBtn}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.textStyle}>Share</Text>
                  )}
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export { ShareModal };

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    height: 300,
    width: wp(90),
    backgroundColor: "#fff",
    borderRadius: hp(1),
    alignSelf: "center",
  },
  title: {
    fontSize: 21,
    fontWeight: "600",
    color: colors.lightTheme,
    left: 16,
  },
  uncheck: {
    height: 22,
    width: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "grey",
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cardBox: {
    flex: 0.8,
    flexDirection: "row",

    alignItems: "center",
  },
  check: {
    flex: 0.2,

    alignItems: "center",
  },
  subTitle: {
    flexDirection: "row",
    width: 70,

    justifyContent: "space-between",
    alignItems: "center",
  },
  textStyle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  userImg: { height: 45, width: 45, borderRadius: 45 },
  body: {
    flex: 0.85,
  },
  userCard: {
    flexDirection: "row",
    width: 180,
    height: 60,

    alignItems: "center",
    justifyContent: "space-between",
  },

  footer: {
    flex: 0.15,

    alignItems: "flex-end",
    justifyContent: "center",
  },
  cross: {
    backgroundColor: "lightgrey",
    height: 35,
    width: 35,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -15,
    right: -5,
    zIndex: 100,
  },
  shareBtn: {
    height: 30,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightTheme,
    borderRadius: 10,
    marginRight: 15,
  },
});
