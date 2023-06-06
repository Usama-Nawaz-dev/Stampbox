import React, { useContext, useEffect } from "react";
import { Text, View, FlatList } from "react-native";

import { createMaterialTopTabNavigator } from "../../../../CustomPackages/material-top-tabs";
import colors from "../../../../constant/colors";

import PaymentCard from "../../../../components/PaymentCard";

import { styles } from "./styles";
import Helper from "../../../Helper";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useIsFocused } from "@react-navigation/native";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";

const DATA = [1, 2, 3, 4, 5, 6, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1];

const Paid = (props) => {
  const { theme } = useContext(ThemeContext);
  const renderItem = ({ item, index }) => {
    const isEnd = index === DATA.length - 1;
    return (
      <View style={{ marginBottom: 10, marginTop: index == 0 ? 5 : 0 }}>
        <PaymentCard
          onPress={() => props.navigation.navigate("PaymentDetails")}
        />
      </View>
    );
  };
  return (
    <FlatList
      data={DATA}
      style={[styles.listStyle, { backgroundColor: theme?.white}]}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};
const Failed = (props) => {
  const { theme } = useContext(ThemeContext);
const renderItem = ({ item, index }) => {
    const isEnd = index === DATA.length - 1;
    return (
      <View style={{ marginBottom: 10, marginTop: index == 0 ? 5 : 0 }}>
        <PaymentCard
          onPress={() => props.navigation.navigate("PaymentDetails")}
        />
      </View>
    );
  };
  return (
    <FlatList
      data={DATA}
      style={[styles.listStyle, { backgroundColor: theme?.white}]}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};
const Processing = (props) => {
    const { theme } = useContext(ThemeContext);
  const renderItem = ({ item, index }) => {
    const isEnd = index === DATA.length - 1;
    return (
      <View style={{ marginBottom: 10, marginTop: index == 0 ? 5 : 0 }}>
        <PaymentCard
          onPress={() => props.navigation.navigate("PaymentDetails")}
        />
      </View>
    );
  };
  return (
    <FlatList
      data={DATA}
      style={[styles.listStyle, { backgroundColor: theme?.white}]}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};
const Returned = (props) => {
    const { theme } = useContext(ThemeContext);
  const renderItem = ({ item, index }) => {
    const isEnd = index === DATA.length - 1;
    return (
      <View style={{ marginBottom: 10, marginTop: index == 0 ? 5 : 0 }}>
        <PaymentCard
          onPress={() => props.navigation.navigate("PaymentDetails")}
        />
      </View>
    );
  };
  return (
    <FlatList
      data={DATA}
      style={[styles.listStyle, { backgroundColor: theme?.white}]}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};

const PaymentStack = createMaterialTopTabNavigator();

export function PaymentTab(props) {
  const focused = useIsFocused();
    const { theme } = useContext(ThemeContext);
  useEffect(() => {
    if (focused) {
      Helper.showToastMessage("Coming Soon.", colors.blueTheme);
    }
  }, [focused]);

  return (
    <PaymentStack.Navigator
      initialRouteName="Payment"
      tabBarOptions={{
        activeTintColor: theme?.theme,
        inactiveTintColor: theme?.lightText,
        labelStyle: styles.labelStyle,
        indicatorStyle: styles.indicatorStyle,
        tabStyle: styles.tabStyle,
      }}
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: theme?.theme },
        tabBarStyle: {
          backgroundColor: theme.white,
        },
      }}
    >
      <PaymentStack.Screen
        name="Paid"
        component={Paid}
        options={{
          tabBarLabel: "Paid",
        }}
      />
      <PaymentStack.Screen
        name="Failed"
        component={Failed}
        options={{
          tabBarLabel: "Failed",
        }}
      />
      <PaymentStack.Screen
        name="Processing"
        component={Processing}
        options={{
          tabBarLabel: "Processing",
        }}
      />
      <PaymentStack.Screen
        name="Returned"
        component={Returned}
        options={{
          tabBarLabel: "Returned",
        }}
      />
    </PaymentStack.Navigator>
  );
}
