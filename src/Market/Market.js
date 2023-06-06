import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { createMaterialTopTabNavigator } from "../../CustomPackages/material-top-tabs";

import { MarketTab } from "./MarketTab";
import { AppHeader } from "../../components";

import { useSelector } from "react-redux";
import ThemeContext from "../Context/ThemeContext";

import { AllTab } from "./AllTab/AllTab";
import { SalesTab } from "./SalesTab/SalesTab";
import { StoreTab } from "./StoreTab/StoreTab";
import { AuctionTab } from "./AuctionTab/AuctionTab";
import { SuppliesTab } from "./SuppliesTab/SuppliesTab";
import { BountiesTab } from "./BountiesTab/BountiesTab";
import { ForTradeTab } from "./ForTradeTab/ForTradeTab";
import { DiscountedTab } from "./DicountedTab/DiscountedTab";
// import { dark as theme } from "../../constant/colorsConfig";

const Tab = createMaterialTopTabNavigator();

const topTabs = [
  { name: "All", component: AllTab },
  { name: "Trade", component: ForTradeTab },
  { name: "Auction", component: AuctionTab },
  { name: "Bounty", component: BountiesTab },
  { name: "Sales", component: SalesTab },
  { name: "Supplies", component: SuppliesTab },
  { name: "Discounted Item", component: DiscountedTab },
  { name: "Explore Stores", component: StoreTab },
];
const Market = ({ navigation }) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const cartProducts = useSelector((state) => state.DataReducer.cart);
  const { theme } = useContext(ThemeContext);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader
        title={"Market Place"}
        cartLength={cartProducts?.length}
        coins={currentUser?.coins}
        onPressMenu={() => navigation.openDrawer()}
        onPressCart={() => navigation.navigate("MyCart")}
        onPressWallet={() => navigation.navigate("MainWallet")}
      />

      <Tab.Navigator
        initialRouteName="All"
        screenOptions={{
          tabBarShowIcon: true,
          tabBarScrollEnabled: true,
          tabBarStyle: {
            backgroundColor: theme?.white,
          },
          tabBarItemStyle: {
            width: wp(18),
            marginBottom: hp(1),
          },
        }}
      >
        {topTabs.map((screen, index) => {
          let { name, component } = screen;
          // console.log("screen", screen);
          return (
            <Tab.Screen
              name={name}
              component={component}
              options={{
                tabBarLabel: "",
                tabBarIcon: ({ focused }) => (
                  <MarketTab index={index} focused={focused} />
                ),
              }}
            />
          );
        })}
      </Tab.Navigator>
    </View>
  );
};

export { Market };

