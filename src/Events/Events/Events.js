import React, { useContext, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";

import { styles } from "./styles";
import { createMaterialTopTabNavigator } from "../../../CustomPackages/material-top-tabs";

import {
  ClosedTab,
  EventsTab,
  OngoingTab,
  InvitesTab,
  UpcomingTab,
  ParticipatedTab,
} from "../EventTabs";
import AuthContext from "../../Context/AuthContext";
import Helper from "../../Helper";

import { useSelector } from "react-redux";
import { EventHeader } from "./EventHeader";
import ThemeContext from "../../Context/ThemeContext";
const Tab = createMaterialTopTabNavigator();

// For Step by Step Walkthrough
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

const Events = (props) => {
  const eventType = useSelector((state) => state.SheetReducer.eventType);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    showEventGuide();
  }, []);

  const showEventGuide = async () => {
    let eventsGuide = await Helper.getData("eventsGuide");
    if (!eventsGuide) {
      props.start();
      await Helper.storeData("eventsGuide", "false");
    }
  };

  //Making a WalkthroughableTouchableOpacity
  const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

  return (
    <View style={styles.mainConatiner}>
      <EventHeader
        onPressCalendar={() => props.navigation.navigate("Calendar")}
        title={eventType === "Event" ? "Events" : "Exhibitons"}
        onPressBack={() => props.navigation.goBack()}
        onPressAdd={() => props.navigation.navigate("CreateEvent")}
      />
      <CopilotStep
        text={`You create new ${
          eventType === "Event" ? "event" : "exhibitons"
        } by clicking here.`}
        order={1}
        name="firstUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guideIcon} />
      </CopilotStep>
      <CopilotStep
        text="You see events on calander here."
        order={2}
        name="secondUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guideIcon1} />
      </CopilotStep>
      <Tab.Navigator
        initialRouteName="Payment"
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
          name="My Events"
          component={EventsTab}
          options={{
            tabBarLabel:
              eventType === "Event" ? language?.myEvents : "My Exhibitons",
          }}
        />
        <Tab.Screen
          name="Ongoing"
          component={OngoingTab}
          options={{ tabBarLabel: language?.going }}
        />
        <Tab.Screen
          name="Upcoming"
          component={UpcomingTab}
          options={{ tabBarLabel: language?.upcoming }}
        />
        <Tab.Screen
          name="Closed"
          component={ClosedTab}
          options={{ tabBarLabel: language?.closed }}
        />
        <Tab.Screen
          name="Invites"
          component={InvitesTab}
          options={{ tabBarLabel: language?.invitations }}
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
})(Events);
