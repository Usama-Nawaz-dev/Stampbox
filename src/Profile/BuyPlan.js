import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BillingComp, MainHeader } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import Helper from "../Helper";
import allActions from "../../redux/actions";

export const BuyPlan = (props) => {
  // const {
  //   navigation,
  //   route: {
  //     params: { planId },
  //   },
  // } = props;
  const { navigation } = props;
  const planId = props?.route?.params?.planId;
  const dispatch = useDispatch();

  console.log("planId", planId);
  //   const user = useSelector((state) => state.ApiReducer.user);
  const onPurchase = async (method_id) => {
    if (planId) {
      dispatch(allActions.DataAction.AppLoader(true));
      const res = await MindAxios.post(
        Env.createUrl("subscriptions/change-plan-and-payment-method"),
        {
          payment_method: "stripe",
          plan_id: planId,
          payment_method_id: method_id,
          //   on_trial: 1,
        }
      );
      console.log("res-->", res);
      dispatch(allActions.DataAction.AppLoader(false));
      if (res?.status == 200) {
        Helper.showToastMessage("Plan updated successhully", "skyblue");
        navigation.goBack();
      } else {
        Helper.showToastMessage("Couldn't update plan!", "red");
      }
    } else {
      dispatch(allActions.DataAction.AppLoader(true));
      const res = await MindAxios.post(Env.createUrl("payment/methods"), {
        payment_method_id: method_id,
        is_default: true,
      });
      dispatch(allActions.DataAction.AppLoader(false));
      console.log("res", res);
      if (res?.status == 200) {
        Helper.showToastMessage("Card added successhully", "green");
        navigation.goBack();
      }
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <MainHeader
        title={planId ? "Buy Plan" : "Add Card"}
        onPressBack={() => navigation.goBack()}
      />
      <BillingComp onProceed={onPurchase} />
    </View>
  );
};

const styles = StyleSheet.create({});
