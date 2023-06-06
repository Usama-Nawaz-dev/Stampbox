import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Pressable,
  Image,
  Modal,
} from "react-native";
import React, { useContext, useEffect } from "react";
import HeaderWithIcons from "../../components/HeaderWithIcons";
import database from "@react-native-firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import _ from "lodash";
import Helper from "../Helper";
// import { images } from "../../assets/images/Images";
import storage from "@react-native-firebase/storage";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import UserComp from "./UserComp";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../../constant/colors";
import moment from "moment";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Story } from "./Story";
import { SafeAreaView } from "react-native-safe-area-context";
import { CircularPaths } from "./CircularPaths";
import FastImage from "react-native-fast-image";
import Fonts from "../../assets/fonts/Fonts";
import TimeAgo from "../../components/TimeAgo";
import allActions from "../../redux/actions";
import { images } from "../../assets/images/Images";
import ThemeContext from "../Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

const Status = () => {
  const dispatch = useDispatch();
  // const [profile, setProfile] = useState();
  const [userStatus, setUserStaus] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);
  const { theme }= useContext(ThemeContext);
  // let [arr] = useState(null);

  const currentUser = useSelector((state) => state.ApiReducer.user);

  if (currentUser) {
    var { id, username, full_name, first_name, image_url } = currentUser;
  }
  useEffect(() => {
    let dt = database()
      .ref("/status")
      .on("value", (snapshot) => {
        let val = snapshot?.val();
        // console.log("User data: ", val);

        if (!_.isEmpty(val)) {
          let reqArray = Object?.keys(val)?.map((key, index) => {
            // console.log('key', val[key])
            let reqObj = {};
            let keyVal = val[key];
            let imgObj = keyVal?.statusList;
            reqObj.userId = key;
            reqObj.username = keyVal?.statusowner;
            let statusimgList = [];
            let statusList = {};
            let seenList = {};
            if (!_.isEmpty(imgObj)) {
              Object?.keys(imgObj)?.forEach((key, index) => {
                let statusObj = imgObj[key];
                let statusImg = statusObj?.statusImage;
                let statusSeen = statusObj?.seenUsersList;
                let statusId = statusObj?.statusId;
                reqObj.time = key;
                reqObj.userImg = statusObj?.userImage;
                statusimgList.unshift(statusImg);
                statusList[statusId] = statusImg;
                seenList[statusId] = statusSeen;
              });

              reqObj.statusImages = statusimgList;
              reqObj.statusList = statusList;
              reqObj.seenList = seenList;
              return reqObj;
            } else {
              return {};
            }
          });
          // console.log("reqArray", reqArray);
          // let reversed = reqArray;
          reqArray.sort(function (x, y) {
            return x?.userId == id?.toString()
              ? -1
              : y?.userId == id?.toString()
              ? 1
              : 0;
          });
          // console.log(reversed);
          setUserStaus(reqArray);
        }
      });
    return () => database().ref("/status").off("value", dt);
  }, []);

  const chooseFile = async () => {
    try {
      let images = await launchImageLibrary({
        multiple: true,
        maxWidth: 600,
        maxHeight: 600,
        quality: 1,
        // selectionLimit: 10
      });
      console.log("images", images);
      if (images.assets) {
        let imgSrc = images.assets[0]?.uri;
        console.log("images.assets[0]?.uri", imgSrc);
        dispatch(allActions.DataAction.AppLoader(true));
        await upload(imgSrc);
        dispatch(allActions.DataAction.AppLoader(false));
        // setProfile(images.assets[0]?.uri);
      } else {
        Helper.showToastMessage("Couldn't get image", "red");
      }
    } catch (error) {
      Helper.showToastMessage("something went wrong", "red");
    }
  };

  const upload = async (profile) => {
    try {
      let name = full_name ? full_name : first_name ? first_name : username;
      const result = await storage()
        .ref(`/status_image/${Date.now()}Stampbox.jpg`)
        .putFile(profile);
      if (result?.state == "success") {
        const {
          metadata: { fullPath },
        } = result;
        console.log("fullpath", fullPath);
        const storedUrl = await storage().ref(`/${fullPath}`).getDownloadURL();
        console.log("storedUrl", storedUrl);
        const snapshot = await database()
          .ref(`/status/${id}/statusList`)
          .once("value");
        let check = snapshot.exists();
        console.log("exists()", check);
        let now = Date.now();
        let body = {
          statusId: now.toString(),
          statusImage: storedUrl,
          statusTime: now,
          userId: id.toString(),
          userImage: image_url,
          userName: name,
          seenUsersList: { 0: id.toString() },
        };
        console.log("body", body);
        if (!check) {
          await database().ref(`/status/${id}`).set({ statusowner: name });
          await database().ref(`/status/${id}/statusList/${now}`).set(body);
        } else {
          await database().ref(`/status/${id}/statusList/${now}`).set(body);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const checker = (list) => {
    let seenCount = 0;
    Object.keys(list)?.forEach((key, index) => {
      let check = list[key]?.includes(id?.toString());
      if (check) {
        seenCount += 1;
      }
    });
    return seenCount;
  };
  let myitem = { image: image_url };
  const renderItem = ({ item, index }) => {
    let count = item?.seenList && checker(item?.seenList);
    //  console.log("count", count);
    // let sendImg = { image: item?.statusImages[1] };
    let listLen = item?.statusImages?.length;
    return listLen ? (
      <Pressable
        onPress={() => {
          setCurrentItem(item);
          setProgressIndex(0);
          setShowStatus(true);
          setModalVisible(true);
        }}
        style={{
          height: 75,
          width: "93%",
          // backgroundColor: "lightgrey",
          alignSelf: "center",
          // justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          margin: 1,
        }}
      >
        {listLen > 1 ? (
          <>
            <CircularPaths
              data={getDummyArray(item?.statusImages?.length, count)}
            />
            <FastImage
              style={[styles.userImg, { position: "absolute", left: 9 }]}
              source={{ uri: item?.statusImages[listLen - 1] }}
            />
            <View style={{ left: 10 }}>
              <Text style={{ fontWeight: "600", color: theme?.black }}>{item?.username}</Text>
              <TimeAgo time={Number(item?.time)} style={[styles.agoText,{ color: theme?.lightText}]} />
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                height: 62,
                width: 62,
                borderRadius: 35,
                borderColor: count ? "grey" : colors.lightTheme,
                borderWidth: 3,
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 5,
              }}
            >
              <FastImage
                style={[styles.userImg]}
                source={
                  item?.statusImages?.length
                    ? { uri: item?.statusImages[0] }
                    : images.noImg
                }
              />
            </View>

            <View style={{ left: 8 }}>
              <Text style={{ fontWeight: "600", color: theme?.black }}>{item?.username}</Text>
              <TimeAgo time={Number(item?.time)} style={[styles.agoText, { color: theme.lightText}]} />
            </View>
          </>
        )}
      </Pressable>
    ) : null;
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme?.white,
      }}
    >
      <Pressable
        onPress={chooseFile}
        style={{
          height: 70,
          width: "93%",
          // backgroundColor: "lightgrey",
          alignSelf: "center",
          marginTop: 10,
          justifyContent: "center",
        }}
      >
        <UserComp
          label="My status"
          label2="Tap to add status update"
          add={<Ionicons name="add-circle" size={22} color={colors.green} />}
          item={myitem}
        />
      </Pressable>
      <Text
        style={{ fontWeight: "700", color: "grey", margin: 15, fontSize: 16 }}
      >
        Recent Updates
      </Text>
      {/* <Button
        title="update"
        onPress={() => {
          database()
            .ref(`/status/${id}/statusList/1677757851814/seenUsersList`)
            .update({ 0: "55", 1: "19", 2: "53" })
            .then(() => console.log("Data updated."))
            .catch((e) => console.log("error", e));
        }}
      /> */}
      <FlatList
        data={userStatus}
        renderItem={renderItem}
        keyExtractor={Helper.keyGenerator}
      />

      {/* Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <SafeAreaView style={styles.container}>
          <View
            style={{
              height: hp(100),
              width: wp(100),
              backgroundColor: "#FFF",
              backgroundColor: "#000",
              // marginTop: 40
              // borderRadius: 2,
              //   marginBottom: 5
            }}
          >
            {/* <Text onPress={()=> setModalVisible(false)}>close</Text> */}
            <Story
              showStatus={showStatus}
              setShowStatus={setShowStatus}
              progressIndex={progressIndex}
              setProgressIndex={setProgressIndex}
              setModalVisible={setModalVisible}
              currentItem={currentItem}
              userId={id}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

function getDummyArray(limit, count) {
  limit *= 2;
  const nums = [...Array(50).keys()];
  let evens = nums.filter((x) => x % 2 == 0).slice(0, count);
  // console.log('count', count)
  // console.log("index", evens);
  return new Array(limit).fill(0).map((_, index) => {
    let chk = evens?.includes(index);
    if (index % 2 == 0) {
      return { value: 227.5, color: chk ? "grey" : colors.lightTheme };
    } else {
      return { value: 15, color: "transparent" };
    }
  });
}

export { Status };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    // alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderWidth: 20,
    borderRadius: 50,
  },
  userImg: {
    height: 52,
    width: 52,
    // borderWidth: 1,
    borderRadius: 100,
    // borderColor: colors.borderColor
  },
  agoText: {
    fontSize: 12,
    color: colors.lightText,
    fontFamily: Fonts.Inter_Medium,
  },
});
