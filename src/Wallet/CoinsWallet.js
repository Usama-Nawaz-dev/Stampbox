import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import { Card } from "./Card";
import { MainHeader } from "../../components";
import AppText from "../../components/AppText";
import { images } from "../../assets/images/Images";
import HeaderTabs from "../../components/HeaderTabs";

import { WalletTab } from "./WalletTab";
import { useSelector } from "react-redux";
import ThemeContext from "../Context/ThemeContext";

const headers = ["All", "Credit", "Debit"];

const CoinsWallet = (props) => {
  const { navigation } = props;
  const user = useSelector((state) => state.ApiReducer.user);
  const { theme } = useContext(ThemeContext);
  if (user) {
    var { coins } = user;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      <MainHeader
        title="Coins Wallet"
        onPressBack={() => props.navigation.goBack()}
      />
      <Card
        label="Available Coins"
        time="Updated just now"
        val={coins}
        btnLabel="Buy Coins"
        btnLabel2="Exchange Coins"
        icon={images.coin_stack}
        onPress={() => navigation.navigate("Buy")}
      />
      <AppText style={[styles.text, { fontSize: 18, fontWeight: "600" }]}>
        History
      </AppText>

      <HeaderTabs
        headers={headers}
        renderList={({ item, index }) => {
          switch (index) {
            case 0:
              return <WalletTab tab="All" />;
            case 1:
              return <WalletTab tab="Credit" />;
            case 2:
              return <WalletTab tab="Debit" />;
          }
        }}
      />
    </View>
  );
};

export { CoinsWallet };

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    // color: "#fff",
    marginTop: 10,
    marginLeft: 10,
    // bottom: -5,
    fontWeight: "bold",
    // textAlign: "center",
  },
});
