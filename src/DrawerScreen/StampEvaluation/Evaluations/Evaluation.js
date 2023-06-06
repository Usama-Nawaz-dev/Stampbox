import React, { useContext } from "react";
import { View } from "react-native";

import { styles } from "./styles";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { MainHeader } from "../../../../components";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

import { SubmittedTab, ExpertTab } from "../EvaluationTab";
import { createMaterialTopTabNavigator } from "../../../../CustomPackages/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

export const Evaluation = (props) => {
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <MainHeader
        title={"Stamp Evaluation"}
        onPressBack={() => props.navigation.goBack()}
      />

      <Tab.Navigator
        initialRouteName="Payment"
        screenOptions={{
          //use this config
          tabBarActiveTintColor: theme?.theme,
          tabBarInactiveTintColor: theme?.lightText,
          tabBarLabelStyle: styles.labelStyle,
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
          name="Stamps"
          component={SubmittedTab}
          initialParams={{ status: "Pending" }}
          options={{
            tabBarLabel: "Submitted Stamps",
          }}
        />
        <Tab.Screen
          name="Accepted"
          component={SubmittedTab}
          initialParams={{ status: "Accepted" }}
          options={{ tabBarLabel: "Accepted for Evaluation" }}
        />
        <Tab.Screen
          name="Evaluated"
          component={SubmittedTab}
          initialParams={{ status: "Completed" }}
          options={{ tabBarLabel: "Evaluated Stamps" }}
        />
        <Tab.Screen
          name="Rejected"
          component={SubmittedTab}
          initialParams={{ status: "Rejected" }}
          options={{ tabBarLabel: "Rejected" }}
        />
        <Tab.Screen
          name="Eval Req"
          component={ExpertTab}
          initialParams={{ status: "Pending" }}
          options={{ tabBarLabel: "Evaluation Request" }}
        />
        <Tab.Screen
          name="Completed"
          component={ExpertTab}
          initialParams={{ status: "Completed" }}
          options={{ tabBarLabel: "Completed Evaluation" }}
        />
        <Tab.Screen
          name="Unfinished"
          component={ExpertTab}
          initialParams={{ status: "Accepted" }}
          options={{ tabBarLabel: "Unfinished" }}
        />
        <Tab.Screen
          name="unalbled"
          component={ExpertTab}
          initialParams={{ status: "Rejected" }}
          options={{ tabBarLabel: "Unable to Completed" }}
        />
      </Tab.Navigator>
    </View>
  );
};
