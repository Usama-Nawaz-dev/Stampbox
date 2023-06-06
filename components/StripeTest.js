import {
  CardField,
  StripeProvider,
  CardFieldInput,
  useStripe,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import allActions from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import Env from "../api/Env";
import MindAxios from "../api/MindAxios";
import colors from "../constant/colors";
import Helper from "../src/Helper";
import axios from "axios";
import { pushNavigation } from "../constant/navigationMethods";


const StripeTest = (props) => {
  const { body, navigation } = props;
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const billingDetails = {
    name: currentUser?.firstName,
    email: currentUser?.email,
  };
  const stripe = useStripe();
  const dispatch = useDispatch();

  const [card, setCard] = useState(CardFieldInput.Details | null);

  const proceed = async () => {
    // console.log("proceed");
    // setLoading(true);
    dispatch(allActions.DataAction.ActivityModal(true));
    const paymentMethodReq = await stripe.createPaymentMethod({
      paymentMethodType: "Card",
      billingDetails: billingDetails,
    });

    // console.log(
    //   "paymentMethodReq.paymentMethod.id->",
    //   paymentMethodReq?.paymentMethod?.id
    // );
    let bodyCopy = Helper.deepCopy(body);
    bodyCopy.payment_method_id = paymentMethodReq?.paymentMethod?.id;
    let endPoint = bodyCopy?.auction_id ? "auction-orders" : "trade-orders";

    try {
      let res = await axios.post(
        Env.createUrl(endPoint),
        bodyCopy,
        await MindAxios.config()
      );
      console.log('res==>', res)
      dispatch(allActions.DataAction.ActivityModal(false));
      Helper.showToastMessage("Order Placed", "green");
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })


    } catch (e) {
      dispatch(allActions.DataAction.ActivityModal(false));
      console.log("error-->", { e });
      // return {e};
    }
  };

  return (
    <View>
      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={{
          backgroundColor: "#FFFFFF",
          textColor: "#000000",
        }}
        style={{
          width: "95%",
          height: 50,
          marginVertical: 15,
          borderColor: colors.theme,
          borderWidth: 1,
          borderRadius: 5,
          alignSelf: "center",
        }}
        onCardChange={(cardDetails) => {
          // console.log('card', cardDetails)
          setCard(cardDetails);
        }}
        onFocus={(focusedField) => {
          // console.log("focusField", focusedField);
        }}
      />
      {/* <Button title="Confirm payment" onPress={handleConfirmation} /> */}
      {card?.complete ? (
        <TouchableOpacity onPress={proceed}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#BA4D3E", "#D27163"]}
            style={styles.linearGradient}
          >
            <Text style={styles.actionButtonText}> Confirm</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default StripeTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#00aeef",
    borderColor: "red",
    borderWidth: 5,
    borderRadius: 15,
  },
  linearGradient: {
    padding: 16,
    alignSelf: "center",
    width: "90%",
    borderRadius: 10,
    // backgroundColor:
    //   appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    marginVertical: 10,
  },
  actionButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    // fontFamily: appStyles.fontFamily.bold,
    color: "white",
  },
});