import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import * as Linking from 'expo-linking'
import React, { Component, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  IMessage,
  Send,
  SendProps,
} from "react-native-gifted-chat";

import Octicons from "react-native-vector-icons/Octicons";

import EvilIcons from "react-native-vector-icons/EvilIcons";

import Entypo from "react-native-vector-icons/Entypo";

import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import database from "@react-native-firebase/database";
import { useDispatch, useSelector } from "react-redux";
import _, { isEmpty } from "lodash";
import colors from "../../constant/colors";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { images } from "../../assets/images/Images";
import AppText from "../../components/AppText";

import UserComp from "./UserComp";
import Helper from "../Helper";
import ChatHeader from "../../components/Headers/ChatHeader";
import ThemeContext from "../Context/ThemeContext";
import OnlyDropDown from "../../components/OnlyDropDown";
import allActions from "../../redux/actions";
import Fonts from "../../assets/fonts/Fonts";
import { GradBtn } from "../../components";
import ErrorMessage from "../forms/ErrorMessage";
import { TextInput } from "react-native";
import { Modal } from "react-native";
// import { dark as theme } from "../../constant/colorsConfig";

const ChatScreen = (props) => {
  // console.log("props", props);
  // const {
  //   route: {
  //     params: { item },
  //   },
  // } = props;
  const dispatch = useDispatch();
  console.log("item", item);
  const initialState = {
    inverted: false,
    step: 0,
    messages: [],
    loadEarlier: true,
    typingText: null,
    isLoadingEarlier: false,
    appIsReady: false,
    isTyping: false,
  };
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [state, setState] = useState(initialState);
  const [errMsg, setErrMsg] = useState(false);
  const [userBlock, setBlock] = useState();
  const [unread_msg, setUnread] = useState(0);
  // let [msgs] = useState([]);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const { theme } = useContext(ThemeContext);
  if (currentUser) {
    var { id, username, image_url } = currentUser;
  }

  const item = useSelector((state) => state.SheetReducer.otherUser);
  const otherUser_id = Number(item?.type);
  const otherUser = {
    _id: otherUser_id,
    name: item?.from,
    avatar: "https://facebook.github.io/react/img/logo_og.png",
  };
  const user = {
    _id: id,
    name: username,
  };

  const ref = database().ref(`/messages/${id}/${otherUser_id}`);
  const unreadRef = database().ref(`/unreadmessages/${otherUser_id}/${id}`);
  const blockRef = database().ref(`/Userblocked/${id}/${otherUser_id}`);
  useFocusEffect(
    useCallback(() => {
      let dt = ref.on("value", (snapshot) => {
        // console.log("User data: ", snapshot.val());
        let vals = snapshot.val();
        if (!_.isEmpty(vals)) {
          let newVal = Object.keys(vals).map((key, index) => {
            // console.log("key", vals[key]);
            // msgs.push(vals[key]);

            let msg = {};
            msg._id = Number(key);
            msg.text = vals[key].message;
            msg.createdAt = vals[key].time;
            msg.user = { _id: Number(vals[key].from), name: item?.from };
            return msg;
          });
          newVal?.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          console.log("vzl", newVal);
          // setMsgs(newVal)
          setState({
            messages: newVal, // messagesData.filter(message => message.system),
            appIsReady: true,
            isTyping: false,
          });
        } else {
          setState({
            messages: [], // messagesData.filter(message => message.system),
            appIsReady: true,
            isTyping: false,
          });
        }
      });
      let un_read = unreadRef.on("value", (snapshot) => {
        let count_val = snapshot.val();
        // console.log("unread: ", count_val);
        if (!_.isEmpty(count_val)) {
          console.log("count", count_val?.count);
          setUnread(count_val?.count);
        } else {
          setUnread(0);
        }
      });
      let blocking = blockRef.on("value", (snapshot) => {
        let block_val = snapshot.val();
        console.log("block:", block_val);
        if (!_.isEmpty(block_val)) {
          // console.log("count", block_val);
          setBlock(block_val?.user);
        } else {
          setBlock();
        }
      });
      return () => {
        // alert('Screen was unfocused');
        console.log("here");
        ref.off("value", dt);
        unreadRef.off("value", un_read);
        blockRef.off("value", blocking);
        // Useful for cleanup functions
      };
    }, [otherUser_id])
  );
  console.log("msgs", state.messages);

  const onSend = async (messages = []) => {
    console.log("mesgs", messages);
    let my_msg = messages[0].text;
    let body = {
      from: id?.toString(),
      message: my_msg,
      seen: false,
      // time: Date?.now(),
      type: "text",
      createdAt: database.ServerValue.TIMESTAMP,
    };
    let otherBody = {
      from: item?.from,
      message: item?.message,
      seen: false,
      // time: Date?.now(),
      type: item?.type?.toString(),
    };
    let other_Body = {
      from: username,
      message: image_url,
      seen: false,
      // time: Date?.now(),
      type: id.toString(),
    };
    console.log("body", body);
    await database()
      .ref(`/messages/${id}/${otherUser_id}/${Date?.now()}`)
      .set({ ...body, time: database.ServerValue.TIMESTAMP });
    await database()
      .ref(`/messages/${otherUser_id}/${id}/${Date?.now()}`)
      .set({ ...body, time: database.ServerValue.TIMESTAMP });
    // messages count
    await unreadRef.set({ count: unread_msg + 1 });
    const snapshot = await database()
      .ref(`/messageUsers/${id}/${otherUser_id}`)
      .once("value");
    console.log("exists()", snapshot.exists());
    if (snapshot.exists()) {
      // do nothing
    } else {
      await database()
        .ref(`/messageUsers/${id}/${otherUser_id}`)
        .set({ ...otherBody, time: database.ServerValue.TIMESTAMP });
      await database()
        .ref(`/messageUsers/${otherUser_id}/${id}`)
        .set({ ...other_Body, time: database.ServerValue.TIMESTAMP });
    }
  };
  const check = userBlock?.blocked_by?.includes(id.toString());
  const isBlocked = userBlock?.blocked_by?.length ? true : false;
  const block_user = async () => {
    let time = Date.now();
    let block_body = {
      // blocked_by: { 0: id?.toString() },
      from: id?.toString(),
      id: "id",
      image: "image",
      is_blocked: false,
      message: "message",
      seen: false,
      time: time,
      type: "text",
    };
    if (!isEmpty(userBlock)) {
      console.log(userBlock);

      console.log("check", check);
      if (!check) {
        let blocked_by = userBlock?.blocked_by;
        if (blocked_by) {
          blocked_by.push(id?.toString());
          block_body.blocked_by = { ...blocked_by };
          block_body.is_blocked = true;
          console.log("block_body0", block_body);
          await block_func(block_body);
        } else {
          // blocked_by.push(id?.toString());
          block_body.blocked_by = { 0: id?.toString() };
          block_body.is_blocked = true;
          console.log("block_body0", block_body);
          await block_func(block_body);
        }
      } else {
        let chkLen = userBlock?.blocked_by?.length;
        if (chkLen > 1) {
          let filterId = userBlock?.blocked_by?.filter(
            (el) => el !== id.toString()
          );
          block_body.blocked_by = { ...filterId };
          block_body.is_blocked = true;
          console.log("block_body2", block_body);
          await block_func(block_body);
        } else {
          block_body.is_blocked = false;
          console.log("block_body3", block_body);
          await block_func(block_body);
        }

        // await block_func(block_body);
      }
    } else {
      block_body.blocked_by = { 0: id?.toString() };
      block_body.is_blocked = true;
      console.log("block_body4", block_body);
      await block_func(block_body);
    }
  };
  const block_func = async (body) => {
    dispatch(allActions.DataAction.AppLoader(true));
    await database().ref(`/Userblocked/${id}/${otherUser_id}/user`).set(body);
    await database().ref(`/Userblocked/${otherUser_id}/${id}/user`).set(body);
    dispatch(allActions.DataAction.AppLoader(false));
  };
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: colors.lightTheme,
          },
          left: {
            backgroundColor: colors.borderColor,
          },
        }}
      />
    );
  };
  const renderSend = (props) => (
    <Send {...props} containerStyle={{ justifyContent: "center" }}>
      <MaterialIcons size={30} color={colors.lightTheme} name={"send"} />
    </Send>
  );

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: theme?.white }]}
        accessibilityLabel="main"
        testID="main"
      >
        <ChatHeader
          online={true}
          item={item}
          label2={"Active now"}
          label={Helper?.capitalizeFirstLetter(item?.from)}
          onPressBack={() => props.navigation.goBack()}
          icon={
            <OnlyDropDown
              data={[
                { value: check ? "Unblock User" : "Block User", id: 1 },
                { value: "Report User", id: 2 },
              ]}
              // value={sort_value}
              onChangeText={(value) => {
                console.log("value", value);
                if (value == "Block User" || value == "Unblock User") {
                  block_user();
                } else {
                  console.log("modal");
                  setReportModalVisible(true);
                }
                // filterFlagsList(value);
              }}
              dropdownOffset={hp(-1.5)}
              position={-3}
              width="40%"
              left={wp(14.3)}
              icon={() => (
                <Entypo
                  name="dots-three-vertical"
                  color="#fff"
                  size={24}
                  style={{ right: 10 }}
                />
              )}
            />
          }
        />
        {/* {isBlocked ? (
          <Text
            style={{
              position: "absolute",
              // top: 20,
              bottom: 50,
              alignSelf: "center",
              color: colors.danger,
            }}
          >
            You can't send message to this user.
          </Text>
        ) : (
          <GiftedChat
            messages={state.messages}
            onSend={onSend}
            renderSend={renderSend}
            user={user}
            scrollToBottom
            onLongPressAvatar={(user) => alert(JSON.stringify(user))}
            onPressAvatar={() => alert("short press")}
            onPress={() => {
              Alert.alert("Bubble pressed");
            }}
            keyboardShouldPersistTaps="never"
            renderBubble={renderBubble}
            quickReplyStyle={{ borderRadius: 2 }}
            quickReplyTextStyle={{
              fontWeight: "200",
            }}
            inverted={Platform.OS !== "web"}
            timeTextStyle={{
              left: { color: "#000" },
              right: { color: "#fff" },
            }}
            isTyping={state.isTyping}
            infiniteScroll
          />
        )} */}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => {
          // Alert.alert(language?.modal_has_been_closed);
          // setJoinModalVisible(!joinModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerSection}>
              <AppText style={styles.joinModalText}>Join eventType</AppText>
              <TouchableOpacity onPress={() => setReportModalVisible(false)}>
                <EvilIcons name="close" size={hp(3.3)} color={colors.cWhite} />
              </TouchableOpacity>
            </View>

            <View style={styles.exhibJoinSection}>
              <AppText>Join As</AppText>
              <View style={styles.modalBtnSection}>
                <TouchableOpacity
                  style={[
                    styles.visitorBtn,
                    {
                      backgroundColor: colors.lightTheme,
                    },
                  ]}
                  // onPress={() => setIsVisitor(true)}
                >
                  <AppText
                    style={{
                      color: colors.lightTheme,
                    }}
                  >
                    Visitor
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.visitorBtn,
                    {
                      backgroundColor: colors.lightTheme,
                    },
                  ]}
                  // onPress={() => setIsVisitor(false)}
                >
                  <AppText
                    style={{
                      color: colors.lightTheme,
                    }}
                  >
                    Participant
                  </AppText>
                </TouchableOpacity>
              </View>
              {/* {!isVisitor && (
                  <View style={styles.mediaSection}>
                    <AppText>Select Media</AppText>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={styles.addStampCard}
                        onPress={() => {
                          setShowModal(true);
                          setJoinModalVisible(false);
                          props.navigation.navigate("ExhibitionStamps");
                        }}
                      >
                        <Octicons
                          name="plus"
                          size={hp(5)}
                          color={colors.lightTheme}
                        />
                      </TouchableOpacity>
                      
                    </View>
                  </View>
                )} */}
            </View>

            <View style={styles.infoSection}>
              <AppText style={styles.msgText}>Write Message*</AppText>
              <TextInput
                // value={joinMsg}
                style={styles.input}
                placeholder="Write Description..."
                label={"enterDescription"}
                onChangeText={(text) => {
                  // setErrMsg(false);
                  // setJoinMsg(text);
                }}
              />
              <ErrorMessage visible={errMsg} error={errMsg} />
              <GradBtn
                width="30%"
                label="Join"
                fontSize={14}
                height={hp(4)}
                // loading={loading}
                style={styles.modalBtn}
                fontFamily={Fonts.IBM_Medium}
                // onPress={isReqAction ? onAcceptInvite : onJoinRequest}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
// export { ChatScreen };

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: {
    height: 100,
    width: wp(100),
    top: -20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "IBMPlexSans-Regular",
    color: colors.cWhite,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 35,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(3),
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  modalView: {
    width: wp(90),
    borderRadius: 7,
    backgroundColor: "#fff",
  },
  headerSection: {
    backgroundColor: "#000",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  joinModalText: {
    fontSize: 16,
    color: colors.cWhite,
    fontFamily: Fonts.IBM_Medium,
  },
  infoSection: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: hp(1),
  },
  msgText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightText,
  },
  input: {
    height: hp(5),
    borderWidth: 1,
    padding: wp(2),
    borderRadius: 7,
    marginTop: hp(1),
    color: colors.lightBlack,
    fontFamily: Fonts.IBM_Regular,
    borderColor: colors.borderColor,
    backgroundColor: colors.background,
  },
  modalBtn: {
    marginTop: hp(2.5),
    marginBottom: hp(1),
  },
  exhibJoinSection: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: hp(1.5),
  },
  modalBtnSection: {
    flexDirection: "row",
    marginTop: hp(0.5),
  },
  visitorBtn: {
    width: "50%",
    height: hp(5),
    borderRadius: 2,
    borderWidth: 1.2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.lightTheme,
  },
  mediaSection: {
    paddingTop: hp(1),
  },
  addStampCard: {
    width: hp(9),
    height: hp(9),
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.cBlack,
    backgroundColor: colors.cWhite,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    marginTop: hp(1),
  },
  editStampCard: {
    width: hp(10),
    height: hp(10),
    borderWidth: 2,
    borderRadius: 5,
    marginTop: hp(1),
    marginLeft: hp(1.5),
    borderColor: colors.lightTheme,
    backgroundColor: colors.cWhite,
  },
  selectedMedia: {
    width: hp(5),
    height: hp(9),
    marginVertical: hp(0.3),
    alignSelf: "center",
  },
  crossIcon: {
    position: "absolute",
    alignSelf: "flex-end",
    color: colors.cBlack,
  },
});
