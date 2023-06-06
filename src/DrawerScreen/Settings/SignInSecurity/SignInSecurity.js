import { View, Text } from "react-native";
import React, { useContext } from "react";
import { MainHeader } from "../../../../components";
import SettingTitleCard from "../../../../components/SettingTitleCard";
import Helper from "../../../Helper";
import ThemeContext from "../../../Context/ThemeContext";

export const SignInSecurity = (props) => {
  const { theme }= useContext(ThemeContext);
  const accAccData = [
    {
      title: "Email Addresses",
      key: 0,
    },
    {
      title: "Phone Numbers",
      key: 1,
    },
    {
      title: "Change Password",
      key: 2,
    },
    {
      title: "2-step Verification",
      key: 3,
    },
    {
      title: "Fingerprint Sign in",
      key: 4,
    },
    {
      title: "App Lock",
      key: 5,
    },
  ];
  return (
    <View style={{flex:1, backgroundColor: theme?.white}}>
      <MainHeader
        title={"Sign in & Security"}
        onPressBack={() => props.navigation.goBack()}
      />
      <SettingTitleCard
        title={"Account Access"}
        optionData={accAccData}
        onPressOption={(item) => {
          if (item.key == 0) {
            props.navigation.navigate("EmailAdress", { item: "email" });
          } else if (item.key == 1) {
            props.navigation.navigate("EmailAdress", { item: "phone" });
          } else if (item.key == 2) {
            props.navigation.navigate("ChangePassword");
          } else if (item.key == 4) {
            props.navigation.navigate("Fingerprint");
          } else {
            Helper.showToastMessage("Coming soon");
          }
        }}
      />
    </View>
  );
};
