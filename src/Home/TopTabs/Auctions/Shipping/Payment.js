import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { SimpleHeader } from "../../../../../components";
import StripeTest from "../../../../../components/StripeTest";
import colors from "../../../../../constant/colors";
import AuthContext from "../../../../Context/AuthContext";

const Payment = (props) => {
    const {body} = props.route.params;
    const { myState: {language}}=useContext(AuthContext);
    // console.log('body', body)
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
    <SimpleHeader
      title={language?.billingDetails}
      onPressBack={() => props.navigation.goBack()}
    />
    <StripeTest body={body} {...props}/>
    </View>
  );
};

export { Payment };

const styles = StyleSheet.create({});
