import React, { useState, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { styles } from "./styles";

import Octicons from "react-native-vector-icons/Octicons";
import { createMaterialTopTabNavigator } from "../../../../CustomPackages/material-top-tabs";

import { DraftsTab } from "./DraftsTab";
import { ClosedTab } from "./ClosedTab";
import { ActiveTab } from "./ActiveTab";
import { HunterInvTab } from "./HunterInvTab";
import { HunterReqTab } from "./HunterReqTab";
import { ArchievedTab } from "./ArchievedTab";
import { PlaceOfferTab } from "./PlaceOfferTab";
import { OfferAcceptedTab } from "./OfferAcceptedTab";

import ThemeContext from "../../../Context/ThemeContext";
import AuthContext from "../../../Context/AuthContext";

import { useSelector } from "react-redux";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const Tab = createMaterialTopTabNavigator();

export const BountyTab = ({ navigation }) => {
  const [isActive, setIsActive] = useState(0);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const userPlan = currentUser?.subscriptions?.length
    ? currentUser?.subscriptions[0]?.subscription_plan?.name
    : null;

  const { openPermissionSheet } = useContext(AuthContext);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (userPlan === "Premium" || userPlan === "Business") {
            navigation.navigate("CreateBounty");
          } else {
            openPermissionSheet();
          }
        }}
      >
        <Octicons name="plus" size={hp(2.5)} color="#fff" />
      </TouchableOpacity>
      <Tab.Navigator
        initialRouteName="Payment"
        tabBarOptions={{
          activeTintColor: theme.theme,
          inactiveTintColor: theme.lightText,
          labelStyle: styles.labelStyle,
        }}
        screenOptions={{
          //use this config
          tabBarIndicatorStyle: { backgroundColor: theme.theme },
          tabBarScrollEnabled: true,
          tabBarStyle: {
            backgroundColor: theme.white,
            height: 45,
            alignItems: "center",
          },
          tabBarItemStyle: {
            width: "auto",
            alignItems: "flex-start",
          },
        }}
      >
        <Tab.Screen
          name="Active"
          component={ActiveTab}
          options={{
            tabBarLabel: "Active",
          }}
        />
        <Tab.Screen
          name="Archived"
          component={ArchievedTab}
          options={{
            tabBarLabel: "Archived",
          }}
        />
        <Tab.Screen
          name="Drafts"
          component={DraftsTab}
          options={{
            tabBarLabel: "Drafts",
          }}
        />
        <Tab.Screen
          name="Closed"
          component={ClosedTab}
          options={{
            tabBarLabel: "Closed",
          }}
        />
        <Tab.Screen
          name="Offer Accepted"
          component={OfferAcceptedTab}
          options={{
            tabBarLabel: "Offer Accepted",
          }}
        />
        <Tab.Screen
          name="Offer Placed"
          component={PlaceOfferTab}
          options={{
            tabBarLabel: "My Placed Offers",
          }}
        />
        <Tab.Screen
          name="HunterInv"
          component={HunterInvTab}
          options={{
            tabBarLabel: "Bounty Hunt Invitations",
          }}
        />
        <Tab.Screen
          name="HunterReq"
          component={HunterReqTab}
          options={{
            tabBarLabel: "My Placed Hunter Requests",
          }}
        />
      </Tab.Navigator>
    </View>
  );
};
