import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import * as Linking from 'expo-linking'
import React, { Component, useEffect, useState } from "react";
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

import AccessoryBar from "./ChatHelpers/AccessoryBar";
// import CustomActions from './example-expo/CustomActions'
// import CustomView from './example-expo/CustomView'
import messagesData from "./ChatHelpers/data/messages";
import earlierMessages from "./ChatHelpers/data/earlierMessages";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import database from "@react-native-firebase/database";
import { useSelector } from "react-redux";
import _ from "lodash";
import colors from "../../constant/colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { images } from "../../assets/images/Images";
import AppText from "../../components/AppText";
import Entypo from "react-native-vector-icons/Entypo";
import UserComp from "./UserComp";
import Helper from "../Helper";
import ChatHeader from "../../components/Headers/ChatHeader";

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
});

const GroupChat = (props) => {
  // console.log("props", props);
  // const {
  //   route: {
  //     params: { item },
  //   },
  // } = props;
  //   console.log("item", item);
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
  const [state, setState] = useState(initialState);
  // let [msgs] = useState([]);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  if (currentUser) {
    var { id, username, image_url } = currentUser;
  }

  const item = useSelector((state) => state.SheetReducer.otherUser);
  //   const otherUser_id = Number(item?.type);
  //   const otherUser = {
  //     _id: otherUser_id,
  //     name: item?.from,
  //     avatar: "https://facebook.github.io/react/img/logo_og.png",
  //   };
  const user = {
    _id: id,
    name: username,
  };

  const ref = database().ref(`/groups/${item?.id}/messages`);

  useFocusEffect(
    useCallback(() => {
      let dt = ref.on("value", (snapshot) => {
        let vals = snapshot.val();
        console.log("User data: ", vals);

        if (!_.isEmpty(vals)) {
          let newVal = Object.keys(vals).map((key, index) => {
            // console.log("key", vals[key]);
            // msgs.push(vals[key]);

            let msg = {};
            msg._id = Number(key);
            msg.text = vals[key].message;
            msg.createdAt = vals[key].time;
            msg.user = { _id: Number(vals[key].from), name: item?.name };
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

      return () => {
        // alert('Screen was unfocused');
        console.log("here");
        database().ref(`/groups/${item?.id}/messages`).off("value", dt);
        // Useful for cleanup functions
      };
    }, [item])
  );
  //   console.log("msgs", state.messages);
  //   let exp = {
  //     from: "11",
  //     id: "1674227631107",
  //     image:
  //       "https://stampbox-project-dev.s3.us-east-2.amazonaws.com/users/user-11/profile-images/16740265829423.",
  //     message: "hello",
  //     seen: false,
  //     time: 1674227631107,
  //     type: "text",
  //   };

  const onSend = async (messages = []) => {
    console.log("mesgs", messages);
    let my_msg = messages[0].text;
    let now = Date?.now();
    let body = {
      from: id?.toString(),
      message: my_msg,
      seen: false,
      time: now,
      type: "text",
      image: image_url,
    };

    console.log("body", body);
    await database().ref(`/groups/${item?.id}/messages/${now}`).set(body);
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

  return (
    <View style={styles.container} accessibilityLabel="main" testID="main">
      <ChatHeader
        item={item}
        label={Helper?.capitalizeFirstLetter(item?.name)}
        label2={"Active now"}
        onPressBack={() => props.navigation.goBack()}
        icon={
          <Entypo
            onPress={() => props.navigation.navigate("GroupInfo")}
            name="users"
            color={colors.cWhite}
            size={24}
            style={{ right: 15 }}
          />
        }
      />
      <GiftedChat
        messages={state.messages}
        onSend={onSend}
        // inverted={true}
        // loadEarlier={state.loadEarlier}
        // onLoadEarlier={onLoadEarlier}
        // isLoadingEarlier={state.isLoadingEarlier}
        user={user}
        scrollToBottom
        onLongPressAvatar={(user) => alert(JSON.stringify(user))}
        onPressAvatar={() => alert("short press")}
        onPress={() => {
          Alert.alert("Bubble pressed");
        }}
        // onQuickReply={onQuickReply}
        keyboardShouldPersistTaps="never"
        // renderAccessory={Platform.OS === 'web' ? null : this.renderAccessory}
        // renderActions={this.renderCustomActions}
        renderBubble={renderBubble}
        // renderSystemMessage={this.renderSystemMessage}
        // renderCustomView={this.renderCustomView}
        quickReplyStyle={{ borderRadius: 2 }}
        quickReplyTextStyle={{
          fontWeight: "200",
        }}
        inverted={Platform.OS !== "web"}
        timeTextStyle={{ left: { color: "#000" }, right: { color: "#fff" } }}
        isTyping={state.isTyping}
        infiniteScroll
      />
    </View>
  );
};
export { GroupChat };
