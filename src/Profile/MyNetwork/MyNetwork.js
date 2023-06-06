import React, { useContext } from "react";
import { View } from "react-native";

import { styles } from "./styles";
import { SimpleHeader } from "../../../components";
import colors from "../../../constant/colors";

import { createMaterialTopTabNavigator } from "../../../CustomPackages/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

import { FollowerTab } from "./FollowerTab";
import { FollowingTab } from "./FollowingTab";
import { RequestTab } from "./RequestTab";
import AuthContext from "../../Context/AuthContext";

import allActions from "../../../redux/actions";
import { useDispatch } from "react-redux";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

export const MyNetwork = (props) => {
  const { params } = props.route;
  const dispatch = useDispatch();

  const {
    myState: { language },
  } = useContext(AuthContext);
  // console.log(language);

  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <SimpleHeader
        rightIcon={true}
        title={language?.myNetwork}
        onPressAdd={() => props.navigation.navigate("FindUser")}
        onPressBack={async () => {
          dispatch(allActions.ApiAction.getUserApi());
          props.navigation.goBack();
        }}
      />
      <Tab.Navigator
        initialRouteName={
          params?.initialRoute ? params?.initialRoute : "Follwers"
        }
        tabBarOptions={{
          activeTintColor: theme?.theme,
          inactiveTintColor: theme?.lightText,
          labelStyle: styles.labelStyle,
        }}
        screenOptions={{
          //use this config
          tabBarIndicatorStyle: { backgroundColor: theme?.theme },
          tabBarStyle: {
            backgroundColor: theme?.white,
          },
        }}
      >
        <Tab.Screen
          name="Follwers"
          component={FollowerTab}
          options={{ tabBarLabel: language?.followers }}
        />
        <Tab.Screen
          name="Following"
          component={FollowingTab}
          options={{ tabBarLabel: "Following" }}
        />
        <Tab.Screen
          name="Requests"
          component={RequestTab}
          options={{ tabBarLabel: "Requests" }}
        />
      </Tab.Navigator>
    </View>
  );
};
