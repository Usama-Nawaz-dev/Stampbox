import { StyleSheet, View } from "react-native";
import React from "react";
import { MainHeader, WalletCard } from "../../components";
import AppText from "../../components/AppText";

import { useSelector } from "react-redux";
import HeaderTabs from "../../components/HeaderTabs";
import { MainTab } from "./MainTab";

const headers = ["Received", "Sent", "Community involved"];
const AllFlags = (props) => {
  const { navigation } = props;
  const user = useSelector((state) => state.ApiReducer.user);
  if (user) {
    var { coins, wallet_balance, first_name, last_name, username } = user;
  }
  // const currentUser = useSelector((state) => state.ApiReducer.user);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <MainHeader
        title="Flags"
        onPressBack={() => props.navigation.goBack()}
      />
      <HeaderTabs
        headers={headers}
        renderList={({ item, index }) => {
          switch (index) {
            case 0:
              return <MainTab navigation={navigation} type={"received"} indexNo={index}/>;
            case 1:
              return <MainTab  navigation={navigation} type={'sent'} indexNo={index}/>;
            case 2:
              return <MainTab navigation={navigation} type={"involved-as-community"} indexNo={index}/>;
          }
        }}
      />
    </View>
  );
};

export { AllFlags };

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    // color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
    // textAlign: "center",
  },
});
