import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { View, ScrollView, Text } from "react-native";

import { styles } from "./styles";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Image from "react-native-fast-image";

import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";

import {
  ShopTab,
  AboutTab,
  ShippingTab,
  PaymentTab,
  SellingTab,
  AuctioningTab,
  OrdersTab,
  TradingTab,
  BountyTab,
  ProposalsTab,
} from "../StoreTabs";

import { NewHeader, MenuSheet } from "../../../components";
import { images } from "../../../assets/images/Images";

import { useDispatch, useSelector } from "react-redux";
import Env from "../../../api/Env";
import Helper from "../../Helper";
import allActions from "../../../redux/actions";
import MindAxios from "../../../api/MindAxios";

import { useFocusEffect } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "../../../CustomPackages/material-top-tabs";
import Fonts from "../../../assets/fonts/Fonts";
import { popNavigation } from "../../../constant/navigationMethods";
import AuthContext from "../../Context/AuthContext";
const Tab = createMaterialTopTabNavigator();

export const Screen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.cWhite,
      }}
    >
      <Text>Hello Form the Screen</Text>
    </View>
  );
};

export const MyStore = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  // console.log('----------->', currentUser)
  const [avatar, setAvatar] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollViewRef = useRef(null);
  const dispatch = useDispatch();
  const {
    myState: { language },
  } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        // alert('Screen was focused');
        await mediaApi();
        await fetchStore();
      })();
      // Do something when the screen is focused
      return () => {
        // alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const mediaApi = async () => {
    const userId = await Helper.getData("userId");
    if (userId) {
      const response = await MindAxios.get(Env.paramUrl("users", userId));
      // console.log("user res--->", response);
      if (response?.status == 200) {
        const {
          data: {
            result: { user: user },
          },
        } = response;
        const {
          store: { profile_media_id: mediaID },
        } = user;
        await dispatch(allActions.ApiAction.getUserApi());
        if (mediaID) {
          const res = await MindAxios.get(Env.paramUrl("medias", `${mediaID}`));
          // console.log("res--->media", res);
          if (res?.status == 200) {
            const {
              data: {
                result: {
                  item: { media_url },
                },
              },
            } = res;
            // console.log("media-->", media_url);
            setAvatar(media_url);
          }
        }
      }
    }
  };

  const fetchStore = async () => {
    const response = await MindAxios.get(
      Env.paramUrl("stores", currentUser?.store?.id)
    );
    // console.log("Store Detail", response?.data?.result?.store)
    if (response.status === 200) {
      const _data = response?.data?.result?.store;
      dispatch(allActions.DetailAction.StoreDetail(_data));
    }
  };

  const onEdit = () => {
    props.navigation.navigate("EditStore");
  };
  const onEditAddress = () => {
    props.navigation.navigate("EditAddress", {
      Address: currentUser?.store?.addresses,
    });
  };

  return (
    // <View style={styles.container}>
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: colors.cWhite }}
      stickyHeaderIndices={[4]}
      // scrollEventThrottle={16}
      // onScroll={onScroll}
    >
      <NewHeader
        title={language?.myStore}
        onPressBack={() => {
          popNavigation();
          props.navigation.goBack();
        }}
      />

      <View style={styles.userSection}>
        <MenuSheet
          button={images.Edit}
          buttonStyle={{ height: 14, width: 14 }}
          style={styles.sheet}
          options={[
            language?.edit + " " + language?.detail,
            language?.edit + " " + language?.address,
            language?.cancel,
          ]}
          actions={[onEdit, onEditAddress]}
        />
        <View style={styles.avatar}>
          <Image
            style={styles.userImage}
            source={
              avatar
                ? {
                    uri: avatar,
                  }
                : images.noImg
            }
          />
        </View>
      </View>

      <View
        style={{
          height: 50,
          width: "100%",
          // backgroundColor: "orange",
          marginBottom: 15,
        }}
      >
        <AppText
          style={{
            textAlign: "center",
            fontSize: 18,
            fontFamily: Fonts.IBM_Bold,
            left: 10,
            marginTop: 5,
          }}
        >
          {currentUser?.store?.name}
        </AppText>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: wp(10),
          }}
        >
          <AppText>
            {language?.storeId}:{" "}
            <AppText style={{ fontWeight: "bold" }}>
              {currentUser?.store?.id}
            </AppText>
          </AppText>
          <AppText>
            {language?.ranking}:{" "}
            <AppText style={{ fontWeight: "bold" }}>
              {currentUser?.rating}.0
            </AppText>
          </AppText>
        </View>
      </View>
      {/* <PaymentTab /> */}

      <View style={{ height: hp(93.5), width: "100%" }}>
        <Tab.Navigator
          initialRouteName="Shop"
          tabBarOptions={{
            activeTintColor: colors.theme,
            inactiveTintColor: colors.lightText,
            labelStyle: styles.labelStyle,
          }}
          screenOptions={{
            //use this config
            tabBarIndicatorStyle: { backgroundColor: colors.theme },
            tabBarScrollEnabled: true,
            tabBarStyle: {
              backgroundColor: "#FFFFFF",
              elevation: 5,
              marginVertical: 1,
              height: 50,
              alignItems: "center",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 0 }, // change this for more shadow
              shadowOpacity: 0.25,
              shadowRadius: 1.84,
            },
            tabBarItemStyle: {
              width: "auto",
              alignItems: "flex-start",
            },
          }}
        >
          <Tab.Screen
            name="Shop"
            component={ShopTab}
            options={{ tabBarLabel: language?.shop }}
          />
          <Tab.Screen
            name="About"
            component={AboutTab}
            options={{ tabBarLabel: language?.about }}
          />
          <Tab.Screen
            name="Orders"
            component={OrdersTab}
            options={{ tabBarLabel: language?.orders }}
          />
          <Tab.Screen
            name="Shipping"
            component={ShippingTab}
            options={{ tabBarLabel: language?.shipping }}
          />
          <Tab.Screen
            name="Payment"
            component={PaymentTab}
            options={{ tabBarLabel: language?.payment }}
          />
          {/* <Tab.Screen
          name="Feedback"
          component={Screen}
          options={{ tabBarLabel: 'Feedback' }}
        /> */}
          <Tab.Screen
            name="Selling"
            component={SellingTab}
            options={{ tabBarLabel: language?.selling }}
          />
          <Tab.Screen
            name="Auctioning"
            component={AuctioningTab}
            options={{ tabBarLabel: language?.auctioning }}
          />
          <Tab.Screen
            name="Trading"
            component={TradingTab}
            options={{ tabBarLabel: language?.trading }}
          />
          <Tab.Screen
            name="Bounty"
            component={BountyTab}
            options={{ tabBarLabel: language?.bounty }}
          />
          <Tab.Screen
            name="Proposals"
            component={ProposalsTab}
            options={{ tabBarLabel: language?.proposals }}
          />
          {/* <Tab.Screen
          name="For_Reference"
          component={Screen}
          options={{ tabBarLabel: 'For Reference' }}
        /> */}
        </Tab.Navigator>
      </View>
    </ScrollView>
  );
};
