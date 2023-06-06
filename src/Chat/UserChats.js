import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Helper from "../Helper";
import database from "@react-native-firebase/database";
import _, { isEmpty } from "lodash";
import { styles } from "./styles";
import colors from "../../constant/colors";
import UserComp from "./UserComp";
import allActions from "../../redux/actions";
import ThemeContext from "../Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";
import Octicons from "react-native-vector-icons/Octicons";
import { EmptyList } from "../../components";
import Empty from "../../components/Empty";

const UserChats = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userMsgs, setUserMsgs] = useState();
  const [un_read, setUnread] = useState({});
  // const [usersOnline, setUsersOnline] = useState();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const usersOnline = useSelector((state) => state.DataReducer.users_list);
  const { theme } = useContext(ThemeContext);
  if (currentUser) {
    var { id, username, image_url } = currentUser;
  }

  // let arr = []
  useEffect(() => {
    (async () => {
      const fcmToken = await Helper.getData("fcmToken");
      if (fcmToken) {
        await database().ref(`/tokens/${id}`).set(fcmToken);
      }
    })();
  }, []);
  const unreadRef = database().ref(`/unreadmessages/${id}`);
  useEffect(() => {
    let dt = database()
      .ref(`/messageUsers/${id}`)
      .on("value", (snapshot) => {
        // console.log("User data: ", snapshot?.val());
        let val = snapshot?.val();
        // console.log("val", val);
        if (!_.isEmpty(val)) {
          let newVal = Object?.keys(val)?.map((key, index) => {
            return val[key];
          });
          // console.log("newval1", newVal);
          setUserMsgs(newVal);
        }
      });
    let un_read = unreadRef.on("value", (snapshot) => {
      let count_val = snapshot.val();
      console.log("unread: ", count_val);
      if (!_.isEmpty(count_val)) {
        // console.log("count", count_val?.coun);
        setUnread(count_val);
      } else {
        setUnread({});
      }
    });

    return () => {
      database().ref(`/messageUsers/${id}`).off("value", dt);
      unreadRef.off("value", un_read);
    };
  }, [id]);
  const userStatusRef = database().ref("Userstatus");

  useEffect(() => {
    userStatusRef.on("value", (snapshot) => {
      let val = snapshot?.val();
      if (!_.isEmpty(val)) {
        let newVal = Object?.keys(val)?.map((key, index) => {
          // console.log("key", key);
          let obj = Helper.deepCopy(val[key]);
          obj.id = key;
          return obj;
        });
        // console.log("newval", newVal);
        dispatch(allActions.DataAction.online_users(newVal));
        // setUsersOnline(newVal);
      }
    });

    return () => {
      userStatusRef.off("value");
    };
  }, []);
  const online = (id) => {
    const object = usersOnline?.find((obj) => obj.id === id);
    // console.log(object);
    return object?.onlineStatus;
  };
  const unreads = (id) => {
    if (!isEmpty(un_read)) {
      let counter = un_read[id];
      console.log("counter", un_read);
      if (counter?.count) {
        return counter?.count;
      } else {
        return null;
      }
    } else {
      return null;
    }
    // console.log(object);
    // return object?.onlineStatus;
  };
  const removeUnread = async (item) => {
    let userId = item?.type;
    console.log("userId", userId);
    let counter = un_read[userId];
    if (counter?.count) {
      dispatch(allActions.DataAction.AppLoader(true));
      await database().ref(`/unreadmessages/${id}/${userId}`).remove();
      dispatch(allActions.DataAction.AppLoader(false));
      dispatch(allActions.SheetAction.user_chat(item));
      navigation.navigate("ChatScreen", { item });
    } else {
      dispatch(allActions.SheetAction.user_chat(item));
      navigation.navigate("ChatScreen", { item });
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme?.white,
      }}
    >
      {userMsgs?.length ? (
        <FlatList
          data={userMsgs}
          style={{ marginTop: 15 }}
          keyExtractor={(item) => item.type}
          renderItem={({ item, index }) => {
            const checkStatus = online(item?.type);
            const count = unreads(item?.type);
            console.log("check", count);
            // let label = checkStatus !== "online" ?  "Active now"

            return (
              <>
                <Pressable
                  onPress={() => removeUnread(item)}
                  style={styles.userSection}
                >
                  <UserComp
                    label={Helper.capitalizeFirstLetter(item?.from)}
                    label2={"Active now"}
                    online={true}
                    active={checkStatus}
                    item={item}
                  />
                  {count ? (
                    <View style={styles.unreadCounter}>
                      <Text style={{ color: "#fff", fontSize: 10 }}>
                        {count}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
                <View
                  style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "lightgrey",
                    marginVertical: 5,
                  }}
                />
              </>
            );
          }}
        />
      ) : (
        <Empty desc="Start chat" />
      )}
    </View>
  );
};

export { UserChats };
