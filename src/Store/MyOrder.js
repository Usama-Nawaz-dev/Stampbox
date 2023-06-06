import { StyleSheet, Text, View, Modal } from "react-native";
import React, { useEffect } from "react";
import { SimpleHeader } from "../../components";
import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import { useState } from "react";
import _, { add } from "lodash";
import FastImage from "react-native-fast-image";
import Entypo from "react-native-vector-icons/Entypo";
import moment from "moment";
import { Button } from "react-native";
import { Pressable } from "react-native";
// https://devapi.stampbox.com/api/store-orders/52
export const MyOrder = ({ navigation, route }) => {
  let id = route?.params?.item?.id;
  const [detail, setDetail] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  //   console.log("first", route.params);
  const dispatch = useDispatch();
  const focused = useIsFocused();
  //   const user = useSelector((state) => state.ApiReducer.user);
  useEffect(() => {
    if (focused) {
      fetchDetail();
    }
  }, [focused]);
  const fetchDetail = async () => {
    const response = await MindAxios.get(Env.paramUrl("store-orders", id));
    // console.log("first", response);
    if (response?.status === 200) {
      const _data = response?.data?.result.item;
      console.log("item", _data);
      setDetail(_data);
    }
  };
  if (!_.isEmpty(detail)) {
    var {
      sale_order: {
        order_meta: { billing_address, shipping_address },
        tax,
      },
      shipment,
      shipping_fee,
      status,
      subtotal,
      transaction,
      products,
    } = detail;
  }

  const handleModalClose = () => {
    setModalVisible(false);
  };
  console.log("detail", detail);
  return (
    <View style={{ flex: 1 }}>
      <SimpleHeader
        title="Order Detail"
        onPressBack={() => navigation.goBack()}
      />
      <View style={{ width: "93%", alignSelf: "center" }}>
        <View style={[styles.card, styles.shadow]}>
          <AppText style={styles.title}>Order No. {detail?.id}</AppText>
          <View style={{ flexDirection: "row" }}>
            <AppText>Tracking Id # </AppText>
            <Text
              onPress={() => {
                console.log(shipment?.label);
                setModalVisible(true);
              }}
              style={{
                fontSize: 11,
                top: 3,
                textDecorationLine: "underline",
                color: colors.lightTheme,
              }}
            >
              {shipment?.tracking_code}
            </Text>
          </View>
          <AppText>
            Order Status:{" "}
            <Text style={{ color: colors.lightTheme, fontSize: 12 }}>
              {status}
            </Text>
          </AppText>
          <AppText style={styles.smallTxt}>
            Payment via Credit/Debit card Paid on:{" "}
            {moment(transaction?.created_at)?.format("YYYY-MM-DD [at] h:mm a")}
          </AppText>
          <AppText style={styles.smallTxt}>Customer IP: 192.168.2.2</AppText>
          {/* ----Billing---- */}
          <Info address={billing_address} label="Billing" />
          <Info address={shipping_address} label="Shipping" />
          <AppText style={[styles.title, { marginTop: 10, marginBottom: 10 }]}>
            Order Summary
          </AppText>
          {products?.length ? (
            <>
              <SummaryHeader />
              <Summary data={products} />
              <View
                style={[
                  styles.card,
                  {
                    marginTop: 10,
                    borderRadius: 1,
                    width: "70%",
                    alignSelf: "flex-end",
                  },
                  // styles.shadow,
                ]}
              >
                <SubTotal
                  keyVal="Sub total($)"
                  val={Number(subtotal).toFixed()}
                />
                <SubTotal keyVal="Shipping charge($)" val={shipping_fee} />
                <SubTotal keyVal="Total" val={tax?.total_amount} />
              </View>
            </>
          ) : null}
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View
          style={{
            flex: 1,
            // backgroundColor: "#000",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={styles.modalContainer}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.cross}
            >
              <Entypo name="cross" color="#000" size={25} />
            </Pressable>
            <FastImage
              source={{
                uri: "https://easypost-files.s3.us-west-2.amazonaws.com/files/postage_label/20230406/cf79aa6e51c540cc96090c666f1797e7.png",
              }}
              style={styles.image}
              resizeMode="cover"
            />
            {/* <Button title="Close" onPress={handleModalClose} /> */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const SubTotal = ({ keyVal, val }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          width: "100%",
          //   alignSelf: "flex-end",
          justifyContent: "space-between",
          marginBottom: 5,
          //   alignItems: "center,
          //   backgroundColor: "orange",
        },
      ]}
    >
      <AppText style={{ fontWeight: "600" }}>{keyVal}</AppText>
      <AppText>{val}</AppText>
    </View>
  );
};

const Separator = ({ vertical }) => {
  return (
    <View
      style={[styles.separator, { marginVertical: vertical ? vertical : 0 }]}
    />
  );
};

const Info = ({ address, label }) => {
  console.log("first", address);
  return (
    <>
      <Separator vertical={5} />
      <AppText style={styles.title}>{label}</AppText>
      <AppText>{address?.name}</AppText>
      <AppText style={styles.smallTxt}>{address?.address}</AppText>
      <AppText style={styles.smallTxt}>{address?.email}</AppText>
      <AppText style={styles.smallTxt}>{address?.phone}</AppText>
    </>
  );
};

const SummaryHeader = () => {
  return (
    <View style={styles.main}>
      <View
        style={[
          styles.summary,
          { width: "10%", backgroundColor: colors.color3 },
        ]}
      >
        <AppText style={styles.txt}>No.</AppText>
      </View>
      <View
        style={[
          styles.summary,
          { backgroundColor: colors.color3, width: "30%" },
        ]}
      >
        <AppText style={styles.txt}>Order</AppText>
      </View>
      <View style={[styles.summary, { backgroundColor: colors.color3 }]}>
        <AppText style={styles.txt}>Price</AppText>
      </View>
      <View style={[styles.summary, { backgroundColor: colors.color3 }]}>
        <AppText style={styles.txt}>Quantity($)</AppText>
      </View>
      <View style={[styles.summary, { backgroundColor: colors.color3 }]}>
        <AppText style={styles.txt}>Total</AppText>
      </View>
    </View>
  );
};
const Summary = ({ data }) => {
  console.log("data", data);

  return (
    <>
      {data?.map((item) => {
        return (
          <View style={[styles.main, { height: 50, alignItems: "center" }]}>
            <View style={[styles.summary, { width: "10%" }]}>
              <AppText style={styles.txt}>{item?.id}</AppText>
            </View>
            <View
              style={[
                styles.summary,
                {
                  width: "30%",
                },
              ]}
            >
              <FastImage
                style={{ height: 25, width: 50 }}
                resizeMode="cover"
                source={{ uri: item?.productable?.medias[0]?.media_url }}
              />
              <AppText
                numberOfLines={1}
                style={[
                  styles.txt,
                  { fontWeight: "normal", fontSize: 9, top: 2 },
                ]}
              >
                {item?.name}
              </AppText>
            </View>
            <View style={[styles.summary]}>
              <AppText style={styles.txt}>
                {Number(item?.pivot?.unit_price).toFixed()}
              </AppText>
            </View>
            <View style={[styles.summary, { backgroundColor: "white" }]}>
              <AppText style={styles.txt}>{item?.pivot?.quantity}</AppText>
            </View>
            <View style={[styles.summary]}>
              <AppText style={styles.txt}>
                {Number(item?.sale_price).toFixed()}
              </AppText>
            </View>
          </View>
        );
      })}
      <Separator />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    // height: 120,
    // width: "90%",
    // alignSelf: "center",
    borderRadius: 5,
    padding: 10,
    backgroundColor: colors.white,
    marginTop: 10,
  },
  smallTxt: { fontSize: 10, fontWeight: "400" },
  txt: { fontSize: 11, fontWeight: "600" },
  title: { fontSize: 14, fontWeight: "600" },
  main: {
    height: 30,
    // width: "90%",
    // alignSelf: "center",
    // backgroundColor: "lightgrey",
    flexDirection: "row",
  },
  cross: {
    backgroundColor: "lightgrey",
    height: 28,
    width: 28,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -15,
    right: -5,
    zIndex: 100,
  },
  summary: {
    height: 30,
    width: "20%",
    // padding: 2,
    // backgroundColor: "orange",
    alignItems: "center",
    // marginLeft: 5,
    justifyContent: "center",
  },
  separator: {
    height: 0.7,
    backgroundColor: colors.color4,
    width: "100%",
  },
  shadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.19,
    shadowRadius: 5.62,
    elevation: 6,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    height: hp(33),
    width: wp(57),
    backgroundColor: "grey",
    // alignSelf: "center",
    justifyContent: "center",
  },
  image: {
    width: hp(25),
    height: wp(70),
    alignSelf: "center",
  },
});
