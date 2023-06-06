import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  CreateEvent,
  EventDetail,
  EditEvent,
  InviteMember,
  BuyTicket,
  CalendarScreen,
} from "../../Events";
import Events from "../../Events/Events/Events";
import { AddItem } from "../../DashBoard/AddItem";
import { StampboxMedia } from "../../DashBoard/StampboxMedia";

const EventStack = createNativeStackNavigator();

export const EventStackNavigator = () => {
  return (
    <EventStack.Navigator>
      <EventStack.Screen
        name="Events"
        component={Events}
        options={{ headerShown: false }}
      />
      <EventStack.Screen
        name="CreateEvent"
        component={CreateEvent}
        options={{ headerShown: false }}
      />
      <EventStack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ headerShown: false }}
      />
      <EventStack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ headerShown: false }}
      />
      <EventStack.Screen
        name="EditEvent"
        component={EditEvent}
        options={{ headerShown: false }}
      />
      <EventStack.Screen
        name="InviteMember"
        component={InviteMember}
        options={{ headerShown: false }}
      />
      <EventStack.Screen
        name="BuyTicket"
        component={BuyTicket}
        options={{ headerShown: false }}
      />
      <EventStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <EventStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
    </EventStack.Navigator>
  );
};
