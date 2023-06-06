import React, { useState, useEffect, useContext } from "react";
import { View, Switch, TouchableOpacity, Alert, Pressable } from "react-native";

import { styles } from "./styles";

import Header from "../../../components/Header";
import AppText from "../../../components/AppText";
import BorderBtn from "../../../components/BorderBtn";
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import colors from "../../../constant/colors";
import AuthContext from "../../Context/AuthContext";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import { MainHeader } from "../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

export const Settings = (props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  // const { signOut } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      let data = await Helper.getData("fingerPrintVAlidation");
      if (data == "true") {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }
    })();
  }, []);
  useEffect(() => {
    Helper.storeData("fingerPrintVAlidation", `${isEnabled}`);
  }, [isEnabled]);
  // const logOut = async () => {
  //   await MindAxios.post(Env.createUrl("logout"));
  //   signOut();
  //   Helper.showToastMessage("Logged out");
  // };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title={language?.settings}
        onPressBack={() => props.navigation.goBack()}
      />
      {/* ************** Content Section *********** */}

      {/* Account Preferences Card */}
      <TouchableOpacity
        onPress={() => props.navigation.navigate("AccPref")}
        style={styles.CardView}
      >
        <View style={styles.iconView}>
          <AntDesign name="user" size={25} color={"#fff"} />
        </View>
        <AppText style={styles.cardText}>Account Preferences</AppText>
      </TouchableOpacity>
      {/* <CardComponent
        icon={
          <AntDesign
            name="user"
            size={25}
            color={"#fff"}
          />
        }
        title="Account Preferences"
        onPress={() => props.navigation.navigate("AccPref")}
      /> */}
      {/* Sign in  & Security Card */}
      <TouchableOpacity
        onPress={() => props.navigation.navigate("SignInSecurity")}
        style={styles.CardView}
      >
        <View style={styles.iconView}>
          <EvilIcons name="unlock" size={35} color={"#fff"} />
        </View>
        <AppText style={styles.cardText}>Sign in & Security</AppText>
      </TouchableOpacity>
      {/* Visibility Card  */}
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Visibility")}
        style={styles.CardView}
      >
        <View style={styles.iconView}>
          <EvilIcons name="eye" size={35} color={"#fff"} />
        </View>
        <AppText style={styles.cardText}>Visibility</AppText>
      </TouchableOpacity>
      {/* Notification Card  */}
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Notifications")}
        style={styles.CardView}
      >
        <View style={styles.iconView}>
          <EvilIcons name="bell" size={35} color={"#fff"} />
        </View>
        <AppText style={styles.cardText}>Notification</AppText>
      </TouchableOpacity>
      {/* Data Privacy Card */}
      <TouchableOpacity
        onPress={() => props.navigation.navigate("DataPrivacy")}
        style={styles.CardView}
      >
        <View style={styles.iconView}>
          <EvilIcons name="lock" size={35} color={"#fff"} />
        </View>
        <AppText style={styles.cardText}>Data Privacy</AppText>
      </TouchableOpacity>
      {/* Help Center Card  */}
      <TouchableOpacity
        onPress={() => props.navigation.navigate("CustomerSupport")}
        style={styles.CardView}
      >
        <View style={styles.iconView}>
          <AntDesign name="infocirlceo" size={20} color={"#fff"} />
        </View>
        <AppText style={styles.cardText}>Help Center</AppText>
      </TouchableOpacity>
    </View>
  );
};

const CardComponent = (props) => {
  const { icon, title } = props;
  console.log("title", title);
  return (
    <Pressable style={styles.CardView}>
      <View style={styles.iconView}>{icon}</View>
      <AppText>{title}</AppText>
    </Pressable>
  );
};
