import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { SimpleHeader } from "../../../../../components";
import colors from "../../../../../constant/colors";
import { BillingComp } from "../../../../../components";
import { useDispatch } from "react-redux";
import allActions from "../../../../../redux/actions";
import MindAxios from "../../../../../api/MindAxios";
import Env from "../../../../../api/Env";
import Helper from "../../../../Helper";
import { popTotop } from "../../../../../constant/navigationMethods";
import { useNavigationState } from "@react-navigation/native";
import AuthContext from "../../../../Context/AuthContext";

const PaymentScreen = (props) => {
  const { body } = props.route.params;
  // console.log("body", body);
  const dispatch = useDispatch();
  const state = useNavigationState((state) => state);

  const { myState: {language}}= useContext(AuthContext);
 
  const onPurchase = async (method_id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    body.payment_method_id = method_id;
    const res = await MindAxios.post(Env.createUrl("auction-orders"), body);
    // console.log("res-->", res);s
    dispatch(allActions.DataAction.AppLoader(false));
    if (res?.status == 200) {
      Helper.showToastMessage("Ticket Purchased successfully", colors.green);
      if (state?.routes?.length > 2) {
        popTotop();
      } else {
        props.navigation.goBack();
      }
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

export { PaymentScreen };

const styles = StyleSheet.create({});
