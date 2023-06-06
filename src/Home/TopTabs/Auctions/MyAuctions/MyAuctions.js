import React, { useContext, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";

import { styles } from "./styles";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";

import { useSelector } from "react-redux";
import { SimpleHeader } from "../../../../../components";

import { createMaterialTopTabNavigator } from "../../../../../CustomPackages/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

import {
  DraftsTab,
  ClosedTab,
  ExpiryTab,
  PaymentTab,
  CurrentTab,
  ShippingTab,
  ParticipatedTab,
} from "../AuctionTab/index";

import Helper from "../../../../Helper";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

// For Step by Step Walkthrough
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

const MyAuctions = (props) => {
  const { navigation } = props;

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const auctionCount = useSelector(
    (state) => state.DetailReducer.auctionCounters
  );

  const auctionCrud = currentUser?.user_permissions?.includes("auctions.crud");

  const { theme, mood } = useContext(ThemeContext);
  const { closeSheet, openPermissionSheet } = useContext(AuthContext);

  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    showAlbumGuide();
  }, []);

  const showAlbumGuide = async () => {
    let auctionGuide = await Helper.getData("showAuctionGuide");
    if (!auctionGuide) {
      props.start();
      await Helper.storeData("showAuctionGuide", "false");
    }
  };

  //Making a WalkthroughableTouchableOpacity
  const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

  const Counter = ({ count }) => {
    return (
      <View style={styles.badgeSection}>
        <AppText style={styles.badgeText}>{count}</AppText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SimpleHeader
        title={language?.myAuctions}
        showIcon={true}
        onPressAdd={() => {
          if (currentUser?.store) {
            auctionCrud
              ? navigation.navigate("AuctionStamps")
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
        text="You can create a new auction from here."
        order={1}
        name="firstUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guideIcon} />
      </CopilotStep>
      <Tab.Navigator
        initialRouteName="Shop"
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
        <Tab.Screen
          name="Current"
          component={CurrentTab}
          options={{
            tabBarLabel: language?.current,
            tabBarBadge: () => (
              <Counter
                count={auctionCount?.cCount ? auctionCount?.cCount : "0"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Drafts"
          component={DraftsTab}
          options={{
            tabBarLabel: language?.DRAFT,
            tabBarBadge: () => (
              <Counter
                count={auctionCount?.dCount ? auctionCount?.dCount : "0"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Expired"
          component={ExpiryTab}
          options={{
            tabBarLabel: "Expired",
            tabBarBadge: () => (
              <Counter
                count={auctionCount?.eCount ? auctionCount?.eCount : "0"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Closed"
          component={ClosedTab}
          options={{
            tabBarLabel: language?.CLOSED,
            tabBarBadge: () => (
              <Counter
                count={auctionCount?.clCount ? auctionCount?.clCount : "0"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Pending Payment"
          component={PaymentTab}
          options={{
            tabBarLabel: language?.PENDING + " " + language?.payment,
            tabBarBadge: () => (
              <Counter
                count={auctionCount?.pCount ? auctionCount?.pCount : "0"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Shipping"
          component={ShippingTab}
          options={{
            tabBarLabel: language?.shipping,
            tabBarBadge: () => (
              <Counter
                count={auctionCount?.sCount ? auctionCount?.sCount : "0"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Participated"
          component={ParticipatedTab}
          options={{ tabBarLabel: language?.participated }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
})(MyAuctions);
