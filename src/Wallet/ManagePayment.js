import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import React, { useCallback, useContext } from "react";
import { HistoryCard, MainHeader } from "../../components";
import { Card } from "./Card";
import { images } from "../../assets/images/Images";
import HeaderTabs from "../../components/HeaderTabs";
import AppText from "../../components/AppText";
import { PaymentTab } from "./PaymentTab";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import Helper from "../Helper";
import Toast from "react-native-root-toast";
import { useState } from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import ThemeContext from "../Context/ThemeContext";
import { WithdrawModal } from "./WithdrawModal";
import colors from "../../constant/colors";
import allActions from "../../redux/actions";

const headers = ["All", "Credit", "Debit"];

const ManagePayment = (props) => {
  const dispatch = useDispatch();
  const [onBoardUrl, setUrl] = useState(null);
  const [status, setStatus] = useState();
  const user = useSelector((state) => state.ApiReducer.user);
  const { theme } = useContext(ThemeContext);
  const [err, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  if (user) {
    var {
      coins,
      wallet_balance,
      first_name,
      last_name,
      username,
      wallet_balance_reserved,
    } = user;
  }
  const submit = async () => {
    console.log("bal", balance);
    if (balance) {
      setLoading(true);
      let body = {
        amount: Number(balance),
      };
      const response = await MindAxios.post(
        Env.createUrl("payment/transfer-wallet-to-sca"),
        body
      );
      if (response?.status == 200) {
        await dispatch(allActions.ApiAction.getUserApi());
        setLoading(false);
        setModalVisible(false);
        setBalance(null);
        Helper.showToastMessage("balance withdrawn successfully!", "green");
      } else {
        setLoading(false);
        Helper.showToastMessage(
          response?.e?.response?.data.message,
          colors.danger
        );
      }
    } else {
      setError("enter amount");
    }
  };
  let prop = {
    err,
    balance,
    loading,
    modalVisible,
    setError,
    setBalance,
    setModalVisible,
    submit,
  };

  useFocusEffect(
    useCallback(() => {
      // setStoreName(Data?.name);

      (async () => {
        // alert('Screen was focused');
        await getUrl();
      })();

      // Do something when the screen is focused
      return () => {
        // alert('Screen was unfocused');
        // setNewImage(null);
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const getUrl = async () => {
    console.log("user?.store", user?.store);
    if (user?.store) {
      const res = await MindAxios.get(
        Env.createUrl(`stores/${user?.store?.id}`)
      );
      console.log("res", res);
      if (res?.status === 200) {
        const _data =
          res?.data?.result?.store?.connected_account?.onboarding_url;
        if (_data) {
          console.log("connected_account", _data);
          setUrl(_data);
          setStatus("notActive");
        } else {
          setStatus("active");
        }
      } else {
        console.log("something went wrong!");
        setStatus("tryAgain");
      }
    } else {
      console.log("store is not created");
      setStatus("noStore");
    }
  };
  const transfer = async () => {
    if (status == "active") {
      console.log("wallet_balance", wallet_balance);
      if (wallet_balance > 0) {
        setModalVisible(true);
      } else {
        Helper.showToastMessage("You don't have sufficient balance", "#000");
      }
    } else if (status == "notActive") {
      // Helper.showToastMessage("message")
      Toast.show("Please activate your account to withdraw payments.", {
        containerStyle: {
          borderRadius: 5,
          flexDirection: "row",
          bottom: 10,
          width: wp(95),
        },
        textStyle: { textAlign: "left", fontSize: 14 },
        duration: 5000,
        position: Toast.positions["BOTTOM"],
        animation: true,
        hideOnPress: true,
        backgroundColor: "#000",
        delay: 0,
        showIcon: false,
        otherLabel: "CONNECT",
        onPress: () => {
          props.navigation.navigate("Activate", { onBoardUrl });
        },
      });
    } else if (status == "tryAgain") {
      await getUrl();
    } else if (status == "noStore") {
      Helper.showToastMessage("Please create store first", "red");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      <MainHeader
        title="Payment Wallet"
        onPressBack={() => props.navigation.goBack()}
      />
      <Card
        label="Available Credit"
        time="Updated just now"
        val={`$${wallet_balance}`}
        reserve={wallet_balance_reserved}
        btnLabel="Transfer Payment"
        btnLabel2="Withdraw Payment"
        icon={images.sack_dollar}
        onPress={transfer}
      />
      <AppText style={[styles.text, { fontSize: 18, fontWeight: "600" }]}>
        History
      </AppText>

      <HeaderTabs
        headers={headers}
        renderList={({ item, index }) => {
          switch (index) {
            case 0:
              return <PaymentTab tab="All" />;
            case 1:
              return <PaymentTab tab="Credit" />;
            case 2:
              return <PaymentTab tab="Debit" />;
          }
        }}
      />
      <WithdrawModal prop={prop} />
    </View>
  );
};

export { ManagePayment };

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
