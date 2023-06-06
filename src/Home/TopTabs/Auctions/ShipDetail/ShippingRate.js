import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { GradBtn } from "../../../../../components";
import { SimpleHeader } from "../../../../../components";
import { StarRatings } from "../../../../../components";
import colors from "../../../../../constant/colors";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
// import { images } from "../../assets/images/Images";
import AppText from "../../../../../components/AppText";
import { light as theme } from "../../../../../constant/colorsConfig";
import Card from "./Card";
import Helper from "../../../../Helper";
// import { SimpleHeader } from "../Headers/SimpleHeader";

export const ShippingRate = ({ navigation, route }) => {

  const {
    sendParam: {
      Item: { auctionable: {medias: [{media_url}], name: stampName}, price: offer_amount  },
      rates,
      bodyNext,
    },
  } = route.params;

  console.log("mediaUrl", route.params);
  console.log("mediaUrl", media_url);
  const [current, setCurrent] = useState(null);
  const [method, setMethod] = useState(null);
  // const card = [...Array(5).keys()];
  const totalAmount = method ? Number(method?.retail_rate) + Number(offer_amount) : 0;
  console.log("total...", totalAmount);
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SimpleHeader
        title="Shipping Rates"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View
            style={{
              width: "100%",
              height: hp(13),
              flexDirection: "row",
              top: 10,
            }}
          >
            <View
              style={{
                width: "40%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
              // resizeMode='contain'
                source={{ uri: media_url }}
                style={{ height: 100, width: 120 }}
              />
            </View>

            <View style={{ width: "60%", justifyContent: "center" }}>
              <AppText style={{ fontWeight: "500" }}>
                {stampName ? Helper.capitalizeFirstLetter(stampName) : ""}
              </AppText>
              <StarRatings rating={3} />
            </View>
          </View>

          <View style={styles.separator} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 13,
            }}
          >
            <AppText style={styles.price}>
              Price:{" "}
              <Text style={{ color: theme.theme }}>
                ${offer_amount ? offer_amount : "00.00"}
              </Text>
            </AppText>
            <AppText style={{ fontSize: 14, fontWeight: "500" }}>
              Total:{" "}
              <Text style={{ color: theme.theme }}>
                ${method ? Number(method?.retail_rate) + Number(offer_amount)  : offer_amount}
              </Text>
            </AppText>
          </View>
        </View>
        {rates?.length
          ? rates?.map((item, index) => {
              return (
                <Card
                  item={item}
                  current={current}
                  setCurrent={setCurrent}
                  index={index}
                  setMethod={setMethod}
                />
              );
            })
          : null}
      </ScrollView>
      <View style={{ height: 90, width: "100%", backgroundColor: "#fff" }}>
        <GradBtn
          label="Confirm"
          width="90%"
          height={50}
          top={10}
          // style={{ position: "absolute", bottom: 40 }}
          onPress={() => {
            if (method) {
              // "shipment_rate_id":"rate_7fa61ede183d4c20a0ac3feb18ed09da",
              // "payment_method_id": "pm_1LZa3wKaXNqc493Zo4aerFfY",
              // "shipping_method":"easypost",
              bodyNext.shipment_rate_id = method?.id;
              bodyNext.shipping_method = method?.billing_type;
              console.log('body', bodyNext);
              navigation.navigate("PaymentScreen", { body: bodyNext });
            } else {
              alert("Please Select a method!");
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: hp(20),
    width: "90%",
    alignSelf: "center",
    // justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  innerCard: {
    backgroundColor: colors.background,
    height: 140,
    width: 120,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    // alignSelf: "flex-start",
  },
  separator: {
    width: "93%",
    height: 1,
    backgroundColor: "lightgrey",
    marginTop: 20,
    alignSelf: "center",
  },
  price: { fontSize: 14, fontWeight: "500" },
});
