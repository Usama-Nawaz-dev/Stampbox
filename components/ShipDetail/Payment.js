import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { SimpleHeader } from "../Headers/SimpleHeader";
import colors from "../../constant/colors";
import { BillingComp } from "..";
import { useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import Helper from "../../src/Helper";
import AuthContext from "../../src/Context/AuthContext";

const Payments = (props) => {
  const { body } = props.route.params;
  const { myState:{ language}}= useContext(AuthContext);
  console.log("body", body);
  const dispatch = useDispatch();
  // let apiBody = {
  //   auction_id: 24,
  //   shipment_rate_id: "rate_255e1d07e4b541178db4f0ca3ca00074",
  //   payment_method_id: "pm_1KlG1DKaXNqc493ZKvgzwuDF",
  //   shipping_address: {
  //     name: "Jon",
  //     email: "Jon@gmail.com",
  //     phone: "1234567899",
  //     address: "street no xyz",
  //     city: "Bufafalo",
  //     state: "NY",
  //     zipcode: "10001",
  //     country: "us",
  //   },
  //   billing_address: {
  //     name: "Jon",
  //     email: "Jon@gmail.com",
  //     phone: "1234567899",
  //     address: "street no xyz",
  //     city: "Palm Beach Gardens",
  //     state: "FL",
  //     zipcode: "33410",
  //     country: "us",
  //   },
  // };
  const onPurchase = async (method_id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    body.payment_method_id = method_id;
    const res = await MindAxios.post(Env.createUrl("auction-orders"), body);
    console.log("res-->", res);
    dispatch(allActions.DataAction.AppLoader(false));
    if (res?.status == 200) {
      Helper.showToastMessage("Ticket Purchased successfully", "skyblue");
      props.navigation.goBack();
    } else {
      Helper.showToastMessage("Couldn't purchased the ticket!", "red");
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SimpleHeader
        title={language?.billingDetails}
        onPressBack={() => props.navigation.goBack()}
      />
      {/* <StripeTest body={body} {...props}/> */}
      <BillingComp onProceed={onPurchase} />
    </View>
  );
};

export { Payments as PaymentScreen };

const styles = StyleSheet.create({});
