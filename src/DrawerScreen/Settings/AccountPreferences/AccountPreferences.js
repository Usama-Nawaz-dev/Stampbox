import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Alert, Vibration } from "react-native";

import { styles } from "./styles";
import { MainHeader } from "../../../../components";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AuthContext from "../../../Context/AuthContext";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import AppText from "../../../../components/AppText";
import Helper from "../../../Helper";
import SettingTitleCard from "../../../../components/SettingTitleCard";
import { ScrollView } from "react-native-gesture-handler";
import colors from "../../../../constant/colors";
import { useSelector } from "react-redux";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";

export const AccountPreferences = (props) => {
  const { signOut } = useContext(AuthContext);
  const [check, setCheck] = useState(false);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const removeAcountAlert = () =>
    Alert.alert(
      "Delete Account ?",
      "Are you sure you want to delete this account ?",
      [{ text: "Cancel" }, { text: "OK", onPress: () => removeAccount() }]
    );

  const removeAccount = async () => {
    const body = { action: "Close" };
    const response = await MindAxios.post(
      Env.createUrl(`users/users/delete/${currentUser?.id}`),
      body
    );
    console.log("hghghghg", response);
    if (response?.status == 200) {
      Helper.showToastMessage(
        "User account removed successfully",
        colors.green
      );
      logOut();
    } else {
      alert(language?.serverError);
    }
  };

  const logOut = async () => {
    await MindAxios.post(Env.createUrl("logout"));
    signOut();
  };

  const sitePrefData = [
    {
      title: "Content languages",
      key: 1,
    },
    {
      title: "Show profile photo",
      key: 2,
    },
    {
      title: "Peoples you unfollowed",
      key: 3,
    },
    {
      title: "Activity logs",
      key: 4,
    },
  ];
  const subsPayData = [
    {
      title: "Current plan",
      key: 1,
    },
    {
      title: "Purchase history",
      key: 2,
    },
    {
      title: "Payment Methods",
      key: 3,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title="Account Preferences"
        onPressBack={() => props.navigation.goBack()}
      />
      {/* ************** Content Section *********** */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        <SettingTitleCard
          title={["Profile information"]}
          optionData={[
            {
              title: "Name, location, bio and gender",
            },
          ]}
          onPressOption={() => props.navigation.navigate("EditProfile")}
        />
        <SettingTitleCard
          title={"Display"}
          optionData={[{ title: "Display mode" }]}
          onPressOption={() => props.navigation.navigate("Display")}
        />
        <SettingTitleCard
          title={"Vibration"}
          optionData={[{ title: "Vibrate on click" }]}
          onPressOption={() => {
            setCheck(!check);
            Vibration.vibrate();
          }}
          icon={
            <View
              style={[
                styles.checkBox,
                {
                  backgroundColor: check ? colors.lightTheme : "transparent",
                  borderWidth: check ? 0 : 1,
                  borderColor: theme?.darkGrey
                },
              ]}
            >
              {check ? (
                <AntDesign name="check" size={17} color={colors.white} />
              ) : null}
            </View>
          }
        />
        <SettingTitleCard
          title={"Site preferences"}
          optionData={sitePrefData}
          onPressOption={(item) => {
            if (item.key == 1) {
              props.navigation.navigate("language");
            } else if (item.key == 2) {
              props.navigation.navigate("ProfileOption");
            } else if (item.key == 3) {
              props.navigation.navigate("Unfollowed");
            } else if (item.key == 4) {
              props.navigation.navigate("ActivityLogs");
            }
          }}
        />
        <SettingTitleCard
          title={"Subscription & payments"}
          optionData={subsPayData}
          onPressOption={(item) => {
            if (item.key == 1) {
              props.navigation.navigate("ChoosePlan");
            } else if (item.key == 3) {
              console.log("here");
              props.navigation.navigate("CreditCards");
            } else if(item.key == 2){
              props.navigation.navigate("PurchaseHistory");
            }
          }}
        />
        <SettingTitleCard
          title={"Sync options"}
          optionData={[{ title: "Sync calendar and contacts" }]}
          onPressOption={() => {
            Helper.showToastMessage("Coming Soom", colors.black);
          }}
        />
        <SettingTitleCard
          title={"Account management"}
          optionData={[
            { title: "Hibernate account", key: 1 },
            { title: "Delete account", key: 2 },
          ]}
          onPressOption={(item) => {
            if (item.key == 2) {
              removeAcountAlert();
            } else {
              props.navigation.navigate("HibernateAccount")
            }
          }}
        />
        <SettingTitleCard
          title={"Terms of Services"}
          optionData={[
            { title: "Terms and Conditions", key: 1 },
            { title: "Privacy policy", key: 2 },
          ]}
          onPressOption={(item) => {
            if (item.key == 1) {
              props.navigation.navigate("Terms");
            } else {
              props.navigation.navigate("PrivacyPolicy");
            }
          }}
        />
      </ScrollView>
      {/* <TouchableOpacity onPress={removeAcountAlert} style={styles.CardView}>
        <View style={styles.iconView}>
          <AntDesign name="deleteuser" size={25} color={"#fff"} />
        </View>
        <AppText style={styles.cardText}>Delete User</AppText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("language")}
        style={styles.CardView}
      >
        <View style={styles.iconView}>
          <FontAwesome name="language" size={22} color={"#fff"} />
        </View>
        <AppText style={styles.cardText}>Change Language</AppText>
      </TouchableOpacity> */}
    </View>
  );
};
