import React, { useState, useContext, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Svg, Path } from "react-native-svg";
import {
  MainStackNavigator,
  ContactStackNavigator,
  MarketStackNavigator,
  NotifyStackNavigator,
  ChatStackNavigator,
  ScanStackNavigator,
} from "./StackNavigator";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import TabButton from "./TabButton";
import AuthContext from "../Context/AuthContext";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import Helper from "../Helper";
import colors from "../../constant/colors";
import AppText from "../../components/AppText";

import Ionicons from "react-native-vector-icons/Ionicons";
import { BottomSheet } from "../../components";
import { MoreSheet } from "./MoreSheet";
import { TabBar } from "./TabBar";
import {
  pushNavigation,
  resetNavigation,
} from "../../constant/navigationMethods";
import ScanModal from "../Scan/ScanModal";
import ThemeContext from "../Context/ThemeContext";
import { icons } from "./bottomIcons/icons";
import { lightIcons } from "./bottomIcons/lightIcons";
import { images } from "../../assets/images/Images";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const dispatch = useDispatch();
  const moreSheetRef = useRef();
  const { theme, mode } = useContext(ThemeContext);
  const showTabs = useSelector((state) => state.DataReducer.showBottomTabs);
  console.log("mode", mode);
  const [selectedIndex, setSelectIndex] = useState(0);
  const { signOut, myState } = useContext(AuthContext);
  const { language } = myState;
  const logOut = async () => {
    await MindAxios.post(Env.createUrl("logout"));
    signOut();
    Helper.showToastMessage("Logged out");
  };
  const screenNavigations = (pushScreen, resetScreen) => {
    // navigation.navigate("MyAuctions");
    if (pushScreen) {
      pushNavigation(pushScreen);
    } else {
      resetNavigation(resetScreen);
    }
    setTimeout(() => {
      moreSheetRef?.current?.close();
    }, 300);
  };
  return (
    <>
      <Tab.Navigator
        // screenOptions={{
        //   tabBarStyle: {
        //     display: "none",
        //   },
        // }}
        tabBar={(props) => {
          props.theme = theme;
          props.mode = mode;
          props.showTabs = showTabs;
          return <TabBar {...props} />;
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: language.home,
            headerShown: false,
            img: images.Feed,
            action: () => {
              // console.log("Home action");
              // dispatch(allActions.ApiAction.setFeedLoad(true));
              // await dispatch(allActions.ApiAction.getFeeds(null, logOut));
              // dispatch(allActions.ApiAction.setFeedLoad(false));
            },
          }}
          component={MainStackNavigator}
        />

        <Tab.Screen
          name="Market"
          component={MarketStackNavigator}
          options={{
            tabBarLabel: language.market,
            img: images.MarketPlace,
            headerShown: false,
            action: () => {
              // console.log("Market action");
            },
          }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanModal}
          options={{
            tabBarLabel: language.scan,
            headerShown: false,
            img: images.Scan,
            action: () => {
              // console.log("Scan action");
              // pushNavigation("ScanModal");
            },
          }}
        />

        <Tab.Screen
          name="Chat"
          component={ChatStackNavigator}
          options={{
            tabBarLabel: language.chat,
            headerShown: false,
            img: images.Chat,
            action: () => {
              // console.log("Chat action");
              dispatch(allActions.SheetAction.chatTab("chats"));
              // props.navigation.navigate("Chat");
              // setSelectIndex(3);
            },
          }}
        />

        <Tab.Screen
          name="Notify"
          component={NotifyStackNavigator}
          options={{
            tabBarLabel: language.more,
            headerShown: false,
            img: images.Menu,
            action: () => {
              moreSheetRef?.current?.open();
            },
          }}
        />
      </Tab.Navigator>

      <BottomSheet
        ref={moreSheetRef}
        sheetHeight={hp(40)}
        ChildComponent={<MoreSheet onPress={screenNavigations} />}
      />
    </>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  moreSection: {
    marginHorizontal: wp(3.2),
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
});

{
  /* <>
{showTabs ? (
  <Tab.Navigator
    // screenOptions={{
    //   tabBarStyle: {
    //     display: "none",
    //   },
    // }}
    tabBar={(props) => {
      props.theme = theme;
      props.mode = mode;
      props.showTabs = showTabs;
      return <TabBar {...props} />;
    }}
  >
    <Tab.Screen
      name="Home"
      options={{
        tabBarLabel: language.home,
        headerShown: false,
        img: images.Feed,
        action: () => {
          // console.log("Home action");
          // dispatch(allActions.ApiAction.setFeedLoad(true));
          // await dispatch(allActions.ApiAction.getFeeds(null, logOut));
          // dispatch(allActions.ApiAction.setFeedLoad(false));
        },
      }}
      component={MainStackNavigator}
    />

    <Tab.Screen
      name="Market"
      component={MarketStackNavigator}
      options={{
        tabBarLabel: language.market,
        img: images.MarketPlace,
        headerShown: false,
        action: () => {
          // console.log("Market action");
        },
      }}
    />
    <Tab.Screen
      name="Scan"
      component={ScanModal}
      options={{
        tabBarLabel: language.scan,
        headerShown: false,
        img: images.Scan,
        action: () => {
          // console.log("Scan action");
          // pushNavigation("ScanModal");
        },
      }}
    />

    <Tab.Screen
      name="Chat"
      component={ChatStackNavigator}
      options={{
        tabBarLabel: language.chat,
        headerShown: false,
        img: images.Chat,
        action: () => {
          // console.log("Chat action");
          dispatch(allActions.SheetAction.chatTab("chats"));
          // props.navigation.navigate("Chat");
          // setSelectIndex(3);
        },
      }}
    />

    <Tab.Screen
      name="Notify"
      component={NotifyStackNavigator}
      options={{
        tabBarLabel: language.more,
        headerShown: false,
        img: images.Menu,
        action: () => {
          moreSheetRef?.current?.open();
        },
      }}
    />
  </Tab.Navigator>
) : (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        display: "none",
        height: 0,
        position: "absolute",
        bottom: -10,
        backgroundColor: "red",
        // backfaceVisibility: false,
      },
      headerShown: false,
    }}
   
  >
    <Tab.Screen name="Home" component={MainStackNavigator} />

    <Tab.Screen name="Market" component={MarketStackNavigator} />
    <Tab.Screen name="Scan" component={ScanModal} />

    <Tab.Screen name="Chat" component={ChatStackNavigator} />

    <Tab.Screen name="Notify" component={NotifyStackNavigator} />
  </Tab.Navigator>
)}

<BottomSheet
  ref={moreSheetRef}
  sheetHeight={hp(40)}
  ChildComponent={<MoreSheet onPress={screenNavigations} />}
/>
</> */
}
