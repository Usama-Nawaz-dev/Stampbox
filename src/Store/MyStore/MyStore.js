import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  View,
  Text,
  Clipboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import Feather from "react-native-vector-icons/Feather";

import {
  ShopTab,
  AboutTab,
  OrdersTab,
  ReportTab,
  BountyTab,
  SellingTab,
  TradingTab,
  PaymentTab,
  ShippingTab,
  ReferenceTab,
  ProposalsTab,
  AuctioningTab,
} from "../StoreTabs";

import { images } from "../../../assets/images/Images";
import { NewHeader, MenuSheet, ExpandableView } from "../../../components";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import Fonts from "../../../assets/fonts/Fonts";
import { popNavigation } from "../../../constant/navigationMethods";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

import { createMaterialTopTabNavigator } from "../../../CustomPackages/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

// For Step by Step Walkthrough
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

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

const MyStore = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  // console.log("----------->", currentUser?.store);
  const [avatar, setAvatar] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollViewRef = useRef(null);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
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

  useEffect(() => {
    showStoreGuide();
  }, []);

  const showStoreGuide = async () => {
    let storeGuide = await Helper.getData("showStoreGuide");
    if (!storeGuide) {
      props.start();
      await Helper.storeData("showStoreGuide", "false");
    }
  };

  //Making a WalkthroughableTouchableOpacity
  const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

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
  const child = (
    <View style={{ backgroundColor: theme?.white }}>
      <View
        style={[styles.userSection, { marginTop: !isExpanded ? -40 : null }]}
      >
        {!isExpanded ? (
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
        ) : null}

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
            // left: 10,
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
          <View style={styles.idSection}>
            <AppText style={styles.rText}>
              {language?.storeId}:{" "}
              <AppText style={styles.uidText}>
                {currentUser?.store?.uuid}
              </AppText>
            </AppText>
            <CopilotStep
              text="You can copy store id by clicking here."
              order={2}
              name="secondUniqueKey"
            >
              <WalkthroughableTouchableOpacity
                onPress={() => {
                  Clipboard.setString(currentUser?.store?.uuid);
                  Helper.showToastMessage("Copied to Clipboard.", colors.green);
                }}
              >
                <Feather name="copy" size={hp(2)} color={theme.theme} />
              </WalkthroughableTouchableOpacity>
            </CopilotStep>
          </View>
          <AppText>
            {language?.ranking}:{" "}
            <AppText style={{ fontWeight: "bold" }}>
              {currentUser?.rating.toFixed(1)}
            </AppText>
          </AppText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      {/* <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: colors.cWhite }}
      stickyHeaderIndices={[4]}
    > */}
      <CopilotStep
        text="You can collapse view by clicking here."
        order={1}
        name="firstUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guideIcon} />
      </CopilotStep>
      <NewHeader
        title={language?.myStore}
        edit
        onEdit={() => {
          setIsExpanded(!isExpanded);
          // setTimeout(() => {
          //   setIsExpanded(isExpanded);
          // }, 3000);
        }}
        expanded={isExpanded}
        onPressBack={() => {
          popNavigation();
          props.navigation.goBack();
        }}
      />
      <ExpandableView expanded={isExpanded} child={child} />

      {/* <PaymentTab /> */}

      {/* <View style={{ height: hp(93.5), width: "100%" }}> */}
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
          name="Store Roports"
          component={ReportTab}
          options={{ tabBarLabel: "My Store Reports" }}
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
        {/* <Tab.Screen
          name="Auctioning"
          component={AuctioningTab}
          options={{ tabBarLabel: language?.auctioning }}
        /> */}
        {/* <Tab.Screen
          name="Trading"
          component={TradingTab}
          options={{ tabBarLabel: language?.trading }}
        />
        <Tab.Screen
          name="Proposals"
          component={ProposalsTab}
          options={{ tabBarLabel: language?.proposals }}
        /> */}
        <Tab.Screen
          name="Bounty"
          component={BountyTab}
          options={{ tabBarLabel: language?.bounty }}
        />
        <Tab.Screen
          name="For_Reference"
          component={ReferenceTab}
          options={{ tabBarLabel: "For Reference" }}
        />
      </Tab.Navigator>
      {/* </View> */}
    </View>
    // </ScrollView>
  );
};

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
})(MyStore);
