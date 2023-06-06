import React, { useContext, useEffect, useState } from "react";

import MindAxios from "../../../../api/MindAxios";
import { MainHeader } from "../../../../components";
import { useIsFocused } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "../../../../CustomPackages/material-top-tabs";
import { CheckTicket, Community, ContactUs, Faq, Help } from "./Support";
import ThemeContext from "../../../Context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import allActions from "../../../../redux/actions";
import { OpenTicket } from "./Support/OpenTicket";

const Tab = createMaterialTopTabNavigator();

const topTabs = [
  { name: "Help", component: Help },
  { name: "Open Ticket", component: OpenTicket },
  { name: "Check Ticket", component: CheckTicket },
  { name: "FAQ", component: Faq },
  { name: "Community", component: Community },
  { name: "Contact Us", component: ContactUs },
];
export const CustomerSupport = (props) => {
  const { theme } = useContext(ThemeContext);
  // const dispatch = useDispatch();
  // const supportToken = useSelector((state) => state.ApiReducer.support_token);
  // const currentUser = useSelector((state) => state.ApiReducer.user);
  // useEffect(() => {
  //   (async () => {
  //     if (!supportToken && currentUser) {
  //       dispatch(allActions.ApiAction.setSupportToken(currentUser));
  //     }
  //   })();
  // }, []);
  return (
    <View style={{ flex: 1 }}>
      <MainHeader
        title="Customer Support"
        onPressBack={() => props.navigation.goBack()}
      />
      <Tab.Navigator
        initialRouteName="Help"
        tabBarOptions={{
          activeTintColor: theme?.theme,
          inactiveTintColor: theme?.lightText,
          labelStyle: styles.labelStyle,
        }}
        screenOptions={{
          //use this config
          tabBarIndicatorStyle: { backgroundColor: theme?.theme },
          tabBarScrollEnabled: true,
          tabBarStyle: {
            backgroundColor: theme?.white,
            height: 50,
            alignItems: "center",
          },
          tabBarItemStyle: {
            width: "auto",
            alignItems: "flex-start",
          },
        }}
      >
        {topTabs.map((screen, index) => {
          let { name, component } = screen;
          // console.log("screen", screen);
          return (
            <Tab.Screen
              name={name}
              component={component}
              options={{
                tabBarLabel: name,
              }}
            />
          );
        })}
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    paddingHorizontal: 5,
    textTransform: "none",
  },
});
