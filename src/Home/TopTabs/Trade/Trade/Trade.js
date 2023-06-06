import React, { useContext, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";

import { styles } from "./styles";
import colors from "../../../../../constant/colors";

import { SimpleHeader } from "../../../../../components";
import { useSelector } from "react-redux";

import Helper from "../../../../Helper";
import { createMaterialTopTabNavigator } from "../../../../../CustomPackages/material-top-tabs";

import {
  DraftTab,
  ActiveTab,
  ExpireTab,
  ProcessingTab,
  CompletedTab,
  AcceptedOfferTab,
  ProposalTab,
} from "../TradeTabs";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../constant/colorsConfig";

const TradeTabs = createMaterialTopTabNavigator();

// For Step by Step Walkthrough
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

export const Trade = (props) => {
  const { navigation } = props;
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const { openPermissionSheet } = useContext(AuthContext);
  const tradeCrud = currentUser?.user_permissions?.includes(
    "my_store.for_trade.view"
  );

  useEffect(() => {
    showTradeGuide();
  }, []);

  const showTradeGuide = async () => {
    let tradeGuide = await Helper.getData("showTradeGuide");
    if (!tradeGuide) {
      props.start();
      await Helper.storeData("showTradeGuide", "false");
    }
  };

  //Making a WalkthroughableTouchableOpacity
  const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

  return (
    <View style={styles.container}>
      <SimpleHeader
        title={language?.myTrade}
        showIcon={true}
        onPressAdd={() => {
          if (currentUser?.store) {
            tradeCrud
              ? navigation.navigate("TradeStamps")
              : openPermissionSheet();
          } else {
            Helper.showToastMessage(
              "Please create your store first.",
              colors.blueTheme
            );
          }
        }}
        onPressBack={() => {
          navigation.goBack();
          // navigation.reset({
          //   index: 0,
          //   routes: [{ name: "Home" }],
          // })
        }}
      />
      <CopilotStep
        text="You can create a new trade from here."
        order={1}
        name="firstUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guideIcon} />
      </CopilotStep>
      <TradeTabs.Navigator
        initialRouteName="Active"
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
        <TradeTabs.Screen
          name="Active"
          component={ActiveTab}
          options={{ tabBarLabel: language?.ACTIVE }}
        />
        <TradeTabs.Screen
          name="Draft"
          component={DraftTab}
          options={{ tabBarLabel: language?.DRAFT }}
        />
        <TradeTabs.Screen
          name="Expired"
          component={ExpireTab}
          options={{ tabBarLabel: language?.EXPIRED }}
        />
        <TradeTabs.Screen
          name="Processing"
          component={ProcessingTab}
          options={{ tabBarLabel: language?.PROCESSING }}
        />
        <TradeTabs.Screen
          name="Completed"
          component={CompletedTab}
          options={{ tabBarLabel: language?.COMPLETED }}
        />
        <TradeTabs.Screen
          name="Proposals"
          component={ProposalTab}
          options={{ tabBarLabel: language?.proposals }}
        />
        <TradeTabs.Screen
          name="Offer Accepted"
          component={AcceptedOfferTab}
          options={{ tabBarLabel: language?.OFFER_ACCEPTED }}
        />
      </TradeTabs.Navigator>
    </View>
  );
};

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
})(Trade);
