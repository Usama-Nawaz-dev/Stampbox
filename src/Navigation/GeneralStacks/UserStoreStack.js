import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const UserStoreStack = createNativeStackNavigator();

import { ProductStackNavigator } from "../DrawerNavigator";
import { UserStore } from "../../Market";

export const UserStoreStackNavigator = () => {
  return (
    <UserStoreStack.Navigator>
      <UserStoreStack.Screen
        name="UserStore"
        component={UserStore}
        options={{ headerShown: false }}
      />
      <UserStoreStack.Screen
        name="ProductDetail"
        component={ProductStackNavigator}
        options={{ headerShown: false }}
      />
    </UserStoreStack.Navigator>
  );
};
