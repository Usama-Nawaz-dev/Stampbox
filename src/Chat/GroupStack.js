import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GroupChat } from "./GroupChat";
import { InfoScreen } from "./InfoScreen";
import { AddMore } from "./AddMore";

const GroupStack = createNativeStackNavigator();

export const GroupStackNavigator = () => {
  return (
    <GroupStack.Navigator initialRouteName="GroupChat">
      <GroupStack.Screen
        name="GroupChat"
        component={GroupChat}
        options={{ headerShown: false }}
      />
      <GroupStack.Screen
        name="GroupInfo"
        component={InfoScreen}
        options={{ headerShown: false }}
      />
       <GroupStack.Screen
        name="AddMore"
        component={AddMore}
        options={{ headerShown: false }}
      />
    </GroupStack.Navigator>
  );
};
