import React, { useState, useContext } from "react";
import { View, Clipboard, TouchableOpacity } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Feather from "react-native-vector-icons/Feather";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import { ShopTab, AboutTab } from "../../Store/StoreTabs";
import { NewHeader, ExpandableView } from "../../../components";

import { useDispatch, useSelector } from "react-redux";
import { popNavigation } from "../../../constant/navigationMethods";

import Helper from "../../Helper";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

import { createMaterialTopTabNavigator } from "../../../CustomPackages/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

export const UserStore = (props) => {
  const dispatch = useDispatch();

  // Redux Data
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const storeDetail = useSelector((state) => state.DetailReducer.storeDetail);

  const [isExpanded, setIsExpanded] = useState(false);
  const mediaUri = storeDetail?.profile_media?.media_url;

  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const child = (
    <View style={{ backgroundColor: theme?.white }}>
      <View
        style={[styles.userSection, { marginTop: !isExpanded ? -40 : null }]}
      >
        <View style={styles.avatar}>
          <Image style={styles.userImage} source={{ uri: mediaUri }} />
        </View>
      </View>
      <View style={styles.storeInfo}>
        <AppText style={styles.titleText}>{storeDetail?.name}</AppText>
        <View style={styles.infoSection}>
          <View style={styles.idSection}>
            <AppText style={styles.rText}>
              {language?.storeId}:{" "}
              <AppText style={styles.uidText}>{storeDetail?.uuid}</AppText>
            </AppText>

            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(storeDetail?.uuid);
                Helper.showToastMessage("Copied to Clipboard.", colors.green);
              }}
            >
              <Feather name="copy" size={hp(2)} color={theme.theme} />
            </TouchableOpacity>
          </View>
          <AppText>
            {language?.ranking}:{" "}
            <AppText style={{ fontWeight: "bold" }}>
              {storeDetail?.owner?.rating.toFixed(2)}
            </AppText>
          </AppText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <NewHeader
        title={"User Store"}
        edit
        onEdit={() => {
          setIsExpanded(!isExpanded);
        }}
        expanded={isExpanded}
        onPressBack={() => {
          popNavigation();
          props.navigation.goBack();
        }}
      />
      <ExpandableView expanded={isExpanded} child={child} />

      <View
        style={{
          minHeight: isExpanded ? hp(87) : hp(65),
          width: wp(100),
          backgroundColor: "red",
        }}
      >
        <Tab.Navigator
          initialRouteName="Shop"
          tabBarOptions={{
            activeTintColor: theme?.theme,
            inactiveTintColor: theme?.lightText,
            labelStyle: styles.labelStyle,
          }}
          screenOptions={{
            tabBarIndicatorStyle: { backgroundColor: theme?.theme },
            tabBarStyle: { backgroundColor: theme?.white },
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
        </Tab.Navigator>
      </View>
    </View>
  );
};
