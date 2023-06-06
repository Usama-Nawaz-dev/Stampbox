import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import HeaderWithIcons from "../../components/HeaderWithIcons";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { createMaterialTopTabNavigator } from "../../CustomPackages/material-top-tabs";
import Group from "./Group";
import { UserChats } from "./UserChats";
import { Status } from "./Status";
import colors from "../../constant/colors";
import { styles } from "./styles";
import IconContainer from "../../components/IconContainer";
import Icon from "react-native-vector-icons/Ionicons";
import allActions from "../../redux/actions";
import ThemeContext from "../Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";
import { AppHeader } from "../../components";
import Octicons from "react-native-vector-icons/Octicons";
import PushNotification from "react-native-push-notification";
import Helper from "../Helper";

const Tab = createMaterialTopTabNavigator();
const Chat = ({ navigation }) => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.SheetReducer.chat_tab);
  const { theme } = useContext(ThemeContext);
  const cartProducts = useSelector((state) => state.DataReducer.cart);
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const AddBtn = () => {
    if (show == "status") {
      return null;
    } else if (show == "chats") {
      return (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("OnlyUsers")}
        >
          <Octicons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddUsers")}
        >
          <Octicons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      );
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        title="Chat"
        cartLength={cartProducts?.length}
        coins={currentUser?.coins}
        onPressMenu={() => navigation.openDrawer()}
        onPressCart={() => navigation.navigate("MyCart")}
        onPressWallet={() => navigation.navigate("MainWallet")}
      />

      <Tab.Navigator
        initialRouteName="userchats"
        tabBarOptions={{
          activeTintColor: theme?.theme,
          inactiveTintColor: theme?.lightText,
          labelStyle: styles.labelStyle,
        }}
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: theme?.theme },

          tabBarStyle: {
            backgroundColor: theme?.white,
          },
        }}
      >
        <Tab.Screen
          name="userchats"
          listeners={{
            tabPress: (e) => {
              console.log("chats tab");

              dispatch(allActions.SheetAction.chatTab("chats"));
            },
            swipeEnd: () => {
              dispatch(allActions.SheetAction.chatTab("chats"));
            },
          }}
          component={UserChats}
          options={{ tabBarLabel: "Chats" }}
        />
        <Tab.Screen
          name="status"
          listeners={{
            tabPress: (e) => {
              console.log("status tab");

              dispatch(allActions.SheetAction.chatTab("status"));
            },
            swipeEnd: () => {
              dispatch(allActions.SheetAction.chatTab("status"));
            },
          }}
          component={Status}
          options={{ tabBarLabel: "Status" }}
        />
        <Tab.Screen
          name="group"
          listeners={{
            tabPress: (e) => {
              dispatch(allActions.SheetAction.chatTab("group"));
            },
            swipeEnd: () => {
              dispatch(allActions.SheetAction.chatTab("group"));
            },
          }}
          component={Group}
          options={{ tabBarLabel: "Group" }}
        />
      </Tab.Navigator>
      <AddBtn />
    </View>
  );
};

export { Chat };
// -------------------
// import React, { useState, useCallback, useRef, useEffect } from "react";
// import { Button, View, Alert, Text } from "react-native";
// import YoutubePlayer from "react-native-youtube-iframe";

// export function Chat() {

//   return (
//     <View style={{ flex: 1 }}>
//       <YoutubePlayer height={300} videoId={"iee2TATGMyI"} />
//       <View style={{ top: -50}}>
//         <Text>YouTube videos</Text>
//       <YoutubePlayer height={300} videoId={"3YG4h5GbTqU"} />
//       </View>

//       {/* <Button title={playing ? "pause" : "play"} onPress={togglePlaying} /> */}
//     </View>
//   );
// }
