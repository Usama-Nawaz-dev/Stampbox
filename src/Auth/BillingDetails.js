import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import Header from "../../components/Header";
import StripeTest from "../../components/StripeTest";
import Indicator from "../../components/Indicator";
import AuthContext from "../Context/AuthContext";

const BillingDetails = ({ route, navigation }) => {
  const { planId } = route.params;
  const{myState:{ language }}=useContext(AuthContext)
  // console.log("plan Id", planId)
  const [loading, setLoading] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <Header title={language?.billingDetails} onPress={() => navigation.goBack()} />
      <Text style={{ fontSize: 21, fontWeight: "bold", margin: 20 }}>
       {language?.card_Details}
      </Text>
      <StripeTest planId = {planId}/>
    </View>
  );
};

export default BillingDetails;

const styles = StyleSheet.create({});
