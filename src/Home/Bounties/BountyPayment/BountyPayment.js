import React, { useContext, useState } from "react";
import { View, TextInput } from "react-native";

import { styles } from "./styles";
import AppText from "../../../../components/AppText";
import { MainHeader, BillingComp } from "../../../../components";

import { useDispatch } from "react-redux";
import AuthContext from "../../../Context/AuthContext";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";
import colors from "../../../../constant/colors";

export const BountyPayment = (props) => {
  const dispatch = useDispatch();
  const { offerId } = props.route.params;
  console.log(offerId);
//   const [description, setDescription] = useState(null);

  const {
    myState: { language },
  } = useContext(AuthContext);

  const onPurchase = async (method_id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const res = await MindAxios.post(Env.paramUrl("bounty-offers", offerId), {
      payment_method_id: method_id,
      action_reason: "Accepted",
      status: "Accepted",
    });
    // console.log("res-->", res);
    dispatch(allActions.DataAction.AppLoader(false));
    if (res?.status == 200) {
      Helper.showToastMessage(
        "Bounty offer accepted Successfully",
        colors.green
      );
      props.navigation.goBack();
    } else {
      Helper.showToastMessage(
        "There's some issue while accepting Offer!",
        colors.danger
      );
    }
  };

  return (
    <View style={styles.mainConatiner}>
      <MainHeader
        title={"Bounty Payment"}
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={styles.infoSection}>
        {/* <AppText style={styles.heading}>{language?.write_description}</AppText>
        <TextInput
          multiline
          value={description}
          placeholder={`${language?.write_description}...`}
          style={styles.input}
          onChangeText={(text) => setDescription(text)}
        /> */}
        <AppText style={styles.heading}>{language?.card_Details}</AppText>
        <BillingComp onProceed={onPurchase} />
      </View>
    </View>
  );
};
