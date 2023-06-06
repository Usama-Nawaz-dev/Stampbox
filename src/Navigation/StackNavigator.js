import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Market } from "../Market";
import { Notify } from "../Notify";
import { Chat } from "../Chat";
import Scan from "../Scan";

import Home from "../Home/Home";

import { CreateStore } from "../Store";
import { GeneralStackNavigator, StoreStackNavigator } from "./DrawerNavigator";
import { MyCart } from "../Cart/MyCart";
import { ShipDetail } from "../Home/TopTabs/Auctions/ShipDetail/ShipDetail";

const MainStack = createNativeStackNavigator();
const MarketStack = createNativeStackNavigator();
const NotifyStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
const ScanStack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      {/* <MainStack.Screen
        name="Generals"
        component={GeneralStackNavigator}
        options={{ headerShown: false }}
      /> */}
      {/* <MainStack.Screen
        name="StoreStack"
        component={StoreStackNavigator}
        options={{ headerShown: false }}
      /> */}

      {/* <MainStack.Screen
        name="MyCart"
        component={MyAlbumsStackNavigator}
        options={{ headerShown: false }}
      /> */}

      {/* <MainStack.Screen
        name="TradeScreen"
        component={TradeScreen}
        options={{ headerShown: false }}
      /> */}
    </MainStack.Navigator>
  );
};
const MarketStackNavigator = () => {
  return (
    <MarketStack.Navigator>
      <MarketStack.Screen
        name="Market"
        component={Market}
        options={{ headerShown: false }}
      />
      <MarketStack.Screen
        name="ShipDetails"
        component={ShipDetail}
        options={{ headerShown: false }}
      />
    </MarketStack.Navigator>
  );
};

const NotifyStackNavigator = () => {
  return (
    <NotifyStack.Navigator>
      <NotifyStack.Screen
        name="Notify"
        component={Notify}
        options={{ headerShown: false }}
      />
    </NotifyStack.Navigator>
  );
};

const ChatStackNavigator = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
    </ChatStack.Navigator>
  );
};
const ScanStackNavigator = () => {
  return (
    <ScanStack.Navigator>
      <ScanStack.Screen
        name="Scan"
        component={Scan}
        options={{ headerShown: false }}
      />
    </ScanStack.Navigator>
  );
};

export {
  MainStackNavigator,
  MarketStackNavigator,
  NotifyStackNavigator,
  ChatStackNavigator,
  ScanStackNavigator,
};
