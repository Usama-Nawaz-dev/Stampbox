import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { BillingComp, MainHeader } from "../../components";
import axios from "axios";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import { popNavigation, popTotop } from "../../constant/navigationMethods";
import Helper from "../Helper";
import { useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import AppText from "../../components/AppText";
import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";

const CoinsBilling = (props) => {
  const {
    package: { id, coins, amount },
  } = props.route.params;
  //   console.log("props", props);
  const dispatch = useDispatch();
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const onProceed = async (payment_method_id) => {
    let body = {
      payment_method: "stripe",
      campaign_id: id,
      payment_method_id: payment_method_id,
    };

    // console.log("body->", body);
    try {
      //   dispatch(allActions.DataAction.ActivityModal(true));
      const res = await axios.post(
        Env.createUrl("coins/buy"),
        body,
        await MindAxios.config()
      );
      //   console.log("res==>", res);
      //   dispatch(allActions.DataAction.ActivityModal(false));
      if (res?.status == 200) {
        await dispatch(allActions.ApiAction.getUserApi());
        Helper.showToastMessage("Coins Purchased successfully", "green");
        popTotop();
      } else {
        alert("Couldn't Place Order!");
      }
    } catch (e) {
      //   dispatch(allActions.DataAction.ActivityModal(false));
      console.log("error-->", { e });
      // return {e};
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      <MainHeader
        title="Billing"
        onPressBack={() => props.navigation.goBack()}
      />
      <AppText style={{ fontSize: 16, margin: 10, fontWeight: "bold" }}>
        Order Details
      </AppText>
      <View
        style={{
          height: 30,
          width: "60%",
          //   backgroundColor: "skyblue",
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: 20,
        }}
      >
        <AppText style={{ fontSize: 16, fontWeight: "500" }}>Price($)</AppText>
        <AppText style={{ fontSize: 16, fontWeight: "500" }}>
          {language?.coins}
        </AppText>
      </View>
      <View
        style={{
          height: 30,
          width: "60%",
          //   backgroundColor: "skyblue",
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: 20,
        }}
      >
        <AppText style={{ fontSize: 16, fontWeight: "400", marginLeft: 20 }}>
          {amount}
        </AppText>
        <AppText style={{ fontSize: 16, fontWeight: "400" }}>{coins}</AppText>
      </View>
      <AppText style={{ fontSize: 16, margin: 10, fontWeight: "bold" }}>
        {language?.card_Details}
      </AppText>
      <BillingComp onProceed={onProceed} top={-10} />
    </View>
  );
};

export { CoinsBilling };

const styles = StyleSheet.create({});
