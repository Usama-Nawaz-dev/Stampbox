import { StyleSheet, Appearance, View } from "react-native";
// import {createStackNavigator} from '@react-navigation/native-stack';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useReducer, useRef } from "react";
import AuthContext from "../Context/AuthContext";
import Helper from "../Helper";
import AuthStack from "../Auth/Auth";
import { useSelector, useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import Home from "../Home";
import ActivityModal from "../../components/ActivityModal";
import { AppLoader, BottomSheet } from "../../components";
import { DrawerNavigator, GeneralStackNavigator } from "./DrawerNavigator";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import ThemeContext from "../Context/ThemeContext";
import { dark, light } from "../../constant/colorsConfig";
import NoInternet from "../../components/NoInternet";
import Languages from "../../constant/Languages";
import database from "@react-native-firebase/database";

import { heightPercentageToDP as hp } from "react-native-responsive-screen";
const Stack = createNativeStackNavigator();
// const MainStack = createNativeStackNavigator();
import { PermissionSheet } from "./PermissionSheet";
import colors from "../../constant/colors";
import { OnlineState } from "../../components/OnlineState";

const reducer = (prevState, action) => {
  // console.log('action', action)
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...prevState,
        isSignout: false,
        userToken: action.payload,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isSignout: false,
        userToken: null,
      };
    case "NETINFO":
      return {
        ...prevState,
        isConnected: action.payload,
      };
    case "LANG":
      return {
        ...prevState,
        language: action.payload,
      };
  }
};

const themes = (colorScheme) => (colorScheme === "dark" ? dark : light);

const ThemeProvider = (props) => {
  const [theme, setTheme] = useState(themes());
  const [mode, setMode] = useState("light");
  const [deviceMode, setDeviceMode] = useState("light");

  useEffect(() => {
    Appearance.addChangeListener((scheme) => {
      setDeviceMode(scheme.colorScheme);
    });
  }, [Appearance.getColorScheme()]);
  useEffect(() => {
    async function getTheme() {
      let saved_theme = await Helper.getData("theme");
      console.log("saved_theme", saved_theme);

      if (saved_theme && saved_theme !== "device") {
        setTheme(themes(saved_theme));
        setMode(saved_theme);
      } else {
        setTheme(themes(deviceMode));
        setMode(deviceMode);
      }
    }
    getTheme();
  }, [deviceMode]);

  const changeTheme = (theme_mode) => {
    console.log("theme", theme_mode);
    if (theme_mode !== "device") {
      setTheme(themes(theme_mode));
      setMode(theme_mode);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: theme, mode: mode, changeTheme }}>
      <View style={{ flex: 1, backgroundColor: theme.white }}>
        {props.children}
      </View>
    </ThemeContext.Provider>
  );
};

const lang_checker = (lang) => {
  if (lang == "English") {
    console.log("eng", lang);
    return Languages.en;
  } else if (lang == "Spanish") {
    console.log("sp", lang);
    return Languages.es;
  } else if (lang == "French") {
    console.log("fr", lang);
    return Languages.fr;
  } else if (lang == "Russian") {
    console.log("rus", lang);
    return Languages.ru;
  } else if (lang == "Chinese") {
    console.log("ch", lang);
    return Languages.ch;
  } else if (lang == "Hindi") {
    console.log("hi", lang);
    return Languages.hi;
  }
};
const RootStack = ({ navigation }) => {
  const dispatchRdx = useDispatch();
  const moreSheetRef = useRef();
  const netInfo = useNetInfo();
  const [state, dispatch] = useReducer(reducer, {
    isSignout: true,
    userToken: null,
    isConnected: false,
    language: lang_checker("English"),
  });
  console.log("state", state);
  // DONT USE USEEFFECT THIS WAY
  // IT WILL GIVE ERROR=> destroy is not a function. (in 'destroy()' 'destroy' is an instance of promise)
  // useEffect(async () => {
  //   let token = await Helper.getData("loginToken");
  //   dispatch({
  //     type: "SIGN_IN",
  //     token: token,
  //   });
  // }, []);
  useEffect(() => {
    (async () => {
      let token = await Helper.getData("homeToken");
      let lang = await Helper.getData("language");
      // console.log("lang", lang);
      dispatch({
        type: "SIGN_IN",
        payload: token,
      });
      if (lang) {
        let ln = lang_checker(lang);
        dispatch({
          type: "LANG",
          payload: ln,
        });
      }
    })();
  }, []);
  useEffect(() => {
    console.log("netInfo.isInternetReachable", netInfo.isInternetReachable);
    if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false) {
      dispatch({
        type: "NETINFO",
        payload: false,
      });
    } else {
      dispatch({
        type: "NETINFO",
        payload: true,
      });
    }
  }, [netInfo.isInternetReachable]);
  const authContext = {
    signIn: async (token) => {
      try {
        dispatch({
          type: "SIGN_IN",
          payload: token,
        });
      } catch (e) {
        // console.log(e);
      }
    },
    signOut: async () => {
      try {
        let id = await Helper.getData("userId");
        let now = Date.now();
        console.log("userId", id);
        await database()
          .ref(`/Userstatus/${Number(id)}`)
          .set({ onlineStatus: now });
        await AsyncStorage.removeItem("homeToken");
        await AsyncStorage.removeItem("loginToken");
        await AsyncStorage.removeItem("supportToken");
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("local");
        await AsyncStorage.removeItem("fcmToken");
        dispatchRdx(allActions.DataAction.onSignout());
        dispatchRdx(allActions.ApiAction.onSignout());
        // await AsyncStorage.removeItem("employeeId");
        dispatch({ type: "SIGN_OUT" });
      } catch (e) {
        dispatch({ type: "SIGN_OUT" });
      }
    },
    changeLanguage: (val) => {
      // console.log("lang", val);
      let lang = lang_checker(val);
      dispatch({
        type: "LANG",
        payload: lang,
      });
    },
    openPermissionSheet: () => moreSheetRef?.current?.open(),
    closeSheet: () => moreSheetRef?.current?.close(),

    myState: state,
  };

  if (state.isSignout) {
    return null;
  }
  return (
    <AuthContext.Provider value={authContext}>
      <ThemeProvider>
        <Stack.Navigator
          initialRouteName="auth"
          screenOptions={{
            headerShown: false,
          }}
        >
          {state.userToken === null ? (
            <Stack.Screen name="auth" component={AuthStack} />
          ) : (
            <>
              <Stack.Screen name="main" component={DrawerNavigator} />
              <Stack.Screen
                name="Generals"
                component={GeneralStackNavigator}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
        <OnlineState />
        <ActivityModal />

        <AppLoader />

        <BottomSheet
          ref={moreSheetRef}
          sheetHeight={hp(65)}
          ChildComponent={<PermissionSheet />}
        />
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export default RootStack;

{
  /* <AuthContext.Provider value={authContext}>
<ThemeProvider>
  {state.isConnected ? (
    <>
      <Stack.Navigator
        initialRouteName="auth"
        screenOptions={{
          headerShown: false,
        }}
      >
        {state.userToken === null ? (
          <Stack.Screen name="auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>

      <ActivityModal />

      <AppLoader />
    </>
  ) : (
    <NoInternet modalVisible={true} />
  )}
  <BottomSheet
    ref={moreSheetRef}
    sheetHeight={hp(65)}
    ChildComponent={<PermissionSheet />}
  />
</ThemeProvider>
</AuthContext.Provider> */
}
