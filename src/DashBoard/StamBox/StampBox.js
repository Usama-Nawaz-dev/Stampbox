import React, { useContext } from "react";
import { View } from "react-native";
import { styles } from "./styles";

import colors from "../../../constant/colors";
import { createMaterialTopTabNavigator } from "../../../CustomPackages/material-top-tabs";

import { MainHeader } from "../../../components";
import { OtherMedia } from "./OtherMedia";
import { StampItems } from "./StampItems";
import { SupplyItems } from "./SupplyItem";
import { SampleStamp } from "./SampleStamp";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
import { TouchableOpacity } from "react-native";
// import { dark as theme } from "../../../constant/colorsConfig";

const Tab = createMaterialTopTabNavigator();

export const StamBox = (props) => {
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <MainHeader
        title={language?.myStampbox}
        onPressBack={() => props.navigation.goBack()}
      />
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
          name="StampItems"
          component={StampItems}
          options={{ tabBarLabel: "Actual Stamps" }}
        />
        <Tab.Screen
          name="SampleStamp"
          component={SampleStamp}
          options={{ tabBarLabel: "Sample Stamps" }}
        />
        <Tab.Screen
          name="Supply Items"
          component={SupplyItems}
          options={{ tabBarLabel: "Supply Items" }}
        />
        <Tab.Screen
          name="OtherMedia"
          component={OtherMedia}
          options={{ tabBarLabel: "Other Media" }}
        />
      </Tab.Navigator>
    </View>
  );
};
