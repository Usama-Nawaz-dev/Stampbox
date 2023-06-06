import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { CardView } from "../../components";
import styles from "../styles/SliderEntry.style";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CheckBox from "react-native-vector-icons/Ionicons";

import colors from "../../constant/colors";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import { useDispatch } from "react-redux";
import allActions from "../../redux/actions";
export function SliderEntry(props) {
  const {
    data: { card, id, billing_details },
    index,
    current,
    cus_id,
    refresh,
  } = props;
  const dispatch = useDispatch();
  const defaultCard = cus_id == id;
  const str = card?.exp_year?.toString();
  const expYear = str.slice(-2);
  const exp_month = card?.exp_month?.toString();
  const expMonth = exp_month?.length > 1 ? exp_month : `0${exp_month}`;
  // console.log(props?.data);
  const defaultFunc = async () => {
    if (!defaultCard) {
      dispatch(allActions.DataAction.AppLoader(true));
      const res = await MindAxios.post(Env.createUrl("payment/methods"), {
        payment_method_id: id,
        is_default: true,
      });
      dispatch(allActions.DataAction.AppLoader(false));
      console.log("res", res);
      if (res?.status == 200) {
        refresh("Default");
      }
    }
  };
  const del = () => {
    Alert.alert("Delete card", "Are you sure to delete this card?", [
      { text: "Cancel" },
      { text: "OK", onPress: () => deleteFunc() },
    ]);
  };
  const deleteFunc = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const res = await MindAxios.post(Env.createUrl("payment/methods/delete"), {
      payment_method_id: id,
    });
    dispatch(allActions.DataAction.AppLoader(false));
    console.log("res", res);
    if (res?.status == 200) {
      refresh("All");
    }
  };
  return (
    <View activeOpacity={1} style={styles.slideInnerContainer}>
      <View style={[styles.imageContainer]}>
        <CardView
          name={
            billing_details?.name ? billing_details?.name : "NAME NOT AVAILABLE"
          }
          brand={card?.brand}
          cvc="321"
          scale={1}
          number={`**** **** **** ${card?.last4}`}
          expiry={`${expMonth}/${expYear}`}
          defaultCard={defaultCard}
          defaultFunc={defaultFunc}
          del={del}
        />
      </View>
      {/* {current == index ? (
        <View
          style={{
            height: 45,
            width: "100%",
            // backgroundColor: "orange",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            // zIndex: 1,
            position: "absolute",
            bottom: -10,
            left: 13,
            // top: heightPercentageToDP(30),
          }}
        >
          <TouchableOpacity
            onPress={defaultFunc}
            style={{
              flexDirection: "row",
              alignItems: "center",
              // backgroundColor: "red",
            }}
          >
            {defaultCard ? null : <View style={styles.uncheck} />}
            <Text
              style={{
                marginLeft: 5,
                color: defaultCard ? colors.green : "#000",
              }}
            >
              {defaultCard ? "Default Card" : "Make Default"}
            </Text>
          </TouchableOpacity>

          <Icon onPress={del} name="card-minus" size={30} color={colors.red} />
        </View>
      ) : null} */}
    </View>
  );
}
