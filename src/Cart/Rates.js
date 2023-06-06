import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import {
  GradBtn,
  RateItems,
  SimpleHeader,
  StarRatings,
} from "../../components";
import colors from "../../constant/colors";
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { images } from "../../assets/images/Images";
import AppText from "../../components/AppText";
import { light as theme } from "../../constant/colorsConfig";
import AntDesign from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Helper from "../Helper";
import ShipCard from "./ShipCard";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";
import Btn from "../../components/Btn";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import allActions from "../../redux/actions";
import CountDown from "react-native-countdown-component";
// import { rates } from "./locals";

export const Rates = (props) => {
  // const rate_len = props?.rates?.length;
  const countDownElement = useRef();
  console.log("props", props);
  const cart = useSelector((state) => state.DataReducer.cart);
  const dispatch = useDispatch();
  const [methods, setSelectors] = useState({});
  const [newCart, setNewCart] = useState(null);
  const [load, setLoad] = useState(false);
  const [sent, setSent] = useState(true);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  // const card = [...Array(5).keys()];
  const deformCart = (products) => {
    // let desired = [];
    let stores = products.map((item) => {
      let store = `${item.store_name}_${item.store_id.toString()}`;
      return store;
    });
    let keyCount = 0;
    let uniq = [...new Set(stores)];
    let myObj = {};
    uniq.forEach((store_name) => {
      myObj[store_name] = [];
      ++keyCount;
    });

    // console.log("1st-->", keyCount);
    products.forEach((item) => {
      //   let store = item.store_name;
      // console.log("item", item);
      let store = `${item.store_name}_${item.store_id.toString()}`;
      myObj[store].push(item);
    });
    let val = storeCart(myObj);
    return val;
  };
  const storeCart = (myObj) => {
    let desired = [];
    Object.keys(myObj).map((key, index) => {
      // console.log("key", key);
      desired.push(myObj[key]);
    });
    // console.log('desired', desired)
    let newObj = {};
    desired.forEach((item1, index) => {
      // console.log('index', index)
      newObj[index] = {};
      newObj[index].products = [];
      item1.forEach((item2) => {
        // console.log('index', index)
        // ob1 = {};
        newObj[index].store_id = item2.store_id;
        let shipmentRate = assignStoreIds(item2.store_id);

        newObj[index].shipment_rate_id = shipmentRate;
        // newObj[index].parcels = [];

        let newVAL = { id: item2.product_id, quantity: item2.quantity };
        newObj[index].products.push(newVAL);
      });
    });
    let stores = [];
    // console.log("newObj", newObj);
    Object.keys(newObj).map((key, index) => {
      // console.log("key", key);
      stores.push(newObj[key]);
    });
    // let newVal = { stores: stores };
    // console.log("newReq", JSON.stringify(newVal));

    return stores;
  };
  const assignStoreIds = (storeId) => {
    let val = null;
    Object.keys(methods).filter((key, index) => {
      // console.log("key", methods[key])
      if (key == storeId) {
        val = methods[key];
      }
    });
    // console.log("val", val)
    return val;
  };
  const get_products = (id) => {
    let list = cart?.filter((item) => item.store_id == id);
    console.log("list", list);
    return list;
  };
  const retryAll = async () => {
    let { values, address } = props;
    dispatch(allActions.DataAction.ActivityModal(true));
    let to_address = {
      ...address,
      name: values?.userName,
      email: values?.email,
      phone: values?.phone,
    };
    let nullCartCopy = Helper.deepCopy(props.nullCart);
    let ratesCopy = Helper.deepCopy(props.rates);
    let storeRates = [];
    for (let item of props.nullCart) {
      let body = {
        from_address: item?.from_address,
        to_address: to_address,
        parcels: [item?.parcel],
      };
      console.log("store cart--->", body);
      const res = await MindAxios.post(
        Env.createUrl("shipments/generate-rates"),
        body
      );
      console.log("store cart--->", res);
      if (res?.status == 200) {
        let {
          data: {
            result: { rates },
          },
        } = res;
        console.log("res-->", rates);
        let obj = {};
        obj.id = item?.store_id;
        obj.rates = rates;
        // storeRates.push(obj);
        ratesCopy = ratesCopy?.filter((el) => el.id !== item.store_id);
        nullCartCopy = nullCartCopy?.filter(
          (el) => el.store_id !== item.store_id
        );
        storeRates.push(obj);
      }
    }
    dispatch(allActions.DataAction.ActivityModal(false));
    // console.log("storeRates", ratesCopy);
    // console.log("storeRates", storeRates);
    // console.log("storeRates", nullCartCopy);
    if (storeRates?.length) {
      let merge = [...ratesCopy, ...storeRates];
      let unique = merge.filter((item, i, ar) => ar.indexOf(item) === i);
      // console.log("storerates", merge);
      props.setRates(unique);
      props.setNullCart(nullCartCopy);
      setSent(true);
      handleClick(60);
    }
  };
  const retry = async (item) => {
    let { values, address } = props;

    dispatch(allActions.DataAction.ActivityModal(true));

    let to_address = {
      ...address,
      name: values?.userName,
      email: values?.email,
      phone: values?.phone,
    };
    let cartCopy = Helper.deepCopy(cart);
    let [filterItem] = cartCopy?.filter((el) => el?.store_id == item?.id);

    console.log(filterItem);
    let filtered = props?.rates?.filter((el) => el?.id !== item?.id);
    let getIndex = props?.rates?.findIndex((el) => el?.id == item?.id);
    console.log("filtered", filtered);
    let body = {
      from_address: filterItem?.from_address,
      to_address: to_address,
      parcels: [filterItem?.parcel],
    };
    console.log("store cart--->", body);
    const res = await MindAxios.post(
      Env.createUrl("shipments/generate-rates"),
      body
    );

    dispatch(allActions.DataAction.ActivityModal(false));
    console.log("res", res);
    if (res?.status == 200) {
      let storeRates = Helper.deepCopy(filtered);
      let {
        data: {
          result: { rates },
        },
      } = res;
      console.log("res", rates);
      let obj = {};
      obj.id = filterItem?.store_id;
      obj.rates = rates;
      storeRates.splice(getIndex, 0, obj);

      props.setRates(storeRates);
    }
  };
  const remove = (item) => {
    console.log("item", item);
    console.log("props", props.rates);
    let nullCartCopy = Helper.deepCopy(props.nullCart);
    let cartCopy = Helper.deepCopy(cart);
    cartCopy = cartCopy?.filter((el) => el.store_id !== item.id);
    nullCartCopy = nullCartCopy?.filter((el) => el.store_id !== item.id);
    let filtered = props?.rates?.filter((el) => el?.id !== item?.id);
    console.log("filtered", filtered);
    // dispatch(allActions.DataAction.cart_products(cartCopy));
    console.log("newcart", cartCopy);
    setNewCart(cartCopy);
    props.setNullCart(nullCartCopy);
    props.setRates(filtered);
  };
  const next = () => {
    console.log("show", props?.show);
    if (_.size(props?.rates) == _.size(methods)) {
      let values = props?.values;
      let values2 = props?.values2;
      let shipping_address = {
        ...props.address,
        name: values?.userName,
        email: values?.email,
        phone: values?.phone,
      };
      let billing_address = props?.show
        ? {
            ...props.address2,
            name: values2?.userName,
            email: values2?.email,
            phone: values2?.phone,
          }
        : {
            ...props.address,
            name: values?.userName,
            email: values?.email,
            phone: values?.phone,
          };
      // console.log("okay", shipping_address);
      let store_orders = deformCart(newCart?.length ? newCart : cart);
      let body = {
        store_orders: store_orders,
        shipping_address: shipping_address,
        billing_address: billing_address,
        // payment_method_id: "",
      };
      // props.body = body;
      // props = {...props, body: body};
      props.setBody(body);
      console.log("this-->", props);
      props.setScreen(3);
    } else {
      alert("Plz select all rates");
    }
  };
  const handleClick = (val) => {
    countDownElement?.current?.restart(val);
  };
  const renderItem = ({ item, index }) => {
    // console.log("main", props?.cartData[item?.id]);
    let mainIndex = item?.id;
    const getProducts = get_products(mainIndex);
    // let mainItem = Helper.deepCopy(item);
    // let store_id = item?.id;
    return (
      <View
        style={{
          width: wp(92),
          // backgroundColor: theme?.cardColor,
          // backgroundColor: colors.color2,
          borderWidth: 0.5,
          borderColor: colors.lightTheme,
          marginTop: 10,
          alignSelf: "center",
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: index == props?.rates?.length - 1 ? hp(14) : 5,
        }}
      >
        <RateItems products={getProducts} index={index} />

        {item?.rates?.length ? (
          <>
            <View style={{ alignSelf: "flex-start", marginLeft: 20 }}>
              <AppText
                style={{
                  // color: "grey",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Select Shipping Method
              </AppText>
            </View>
            <View style={{ top: -10 }}>
              {item?.rates?.map((item) => {
                // console.log("item", item);
                let index = item.id;
                // let checker = methods[mainIndex] == index;
                // console.log('checker', checker)
                return (
                  <ShipCard
                    item={item}
                    isSelected={methods[mainIndex] == index}
                    methodSelector={() => {
                      let newMethods = Helper.deepCopy(methods);
                      // console.log("main and lower", methods[mainIndex]);
                      if (_.isEmpty(newMethods)) {
                        newMethods[mainIndex] = index;
                        console.log("from isEmpty method", newMethods);
                        setSelectors(newMethods);
                        // setStoreId(store_id);
                      } else {
                        if (newMethods[mainIndex] == index) {
                          delete newMethods[mainIndex];
                          console.log("from del method", newMethods);
                          setSelectors(newMethods);
                        } else {
                          newMethods[mainIndex] = index;
                          console.log("simple method", newMethods);
                          setSelectors(newMethods);
                        }
                      }
                    }}
                  />
                );
              })}
            </View>
          </>
        ) : (
          <View
            style={{
              alignSelf: "flex-start",
              marginLeft: 20,
              marginBottom: heightPercentageToDP(3),
            }}
          >
            <AppText
              style={{
                color: colors.danger,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              Your account has been temporarily rate-limited due to excessive
              resource consumption.
            </AppText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              {/* <Btn
                label="Retry"
                iconLeft={<Icon name="refresh" size={13} color="#fff" />}
                style={{ height: 25, width: 80 }}
                fontSize={12}
                loading={load}
                onPress={() => retry(item)}
              /> */}
              <Btn
                label="Remove"
                onPress={() => remove(item)}
                iconLeft={<AntDesign name="delete" size={13} color="#fff" />}
                style={{
                  height: 25,
                  width: 90,
                }}
                fontSize={12}
              />
            </View>
          </View>
        )}

        {/* <View style={{ height: 20 }} /> */}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View style={{ width: "95%"}}> */}
        <FlatList
          data={props?.rates}
          // horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
        />
        {/* </View> */}
      </ScrollView>
      <View
        style={{
          height: 90,
          width: "100%",
          backgroundColor: "#fff",
          position: "absolute",
          bottom: 0,
        }}
      >
        {props.nullCart?.length ? (
          // <GradBtn
          //   label={"Retry"}
          //   width="50%"
          //   height={40}
          //   top={10}
          //   onPress={retryAll}
          // />
          <TouchableOpacity
            onPress={retryAll}
            disabled={sent}
            style={{
              height: 50,
              width: "90%",
              borderRadius: 5,
              backgroundColor: colors.lightTheme,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              flexDirection: "row",
              top: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              {sent ? "Retry in" : "Retry"}
            </Text>
            {sent ? (
              <CountDown
                ref={countDownElement}
                until={60}
                onFinish={() => {
                  // console.log("on finish");
                  setSent(false);
                }}
                digitStyle={{
                  color: "transparent",
                }}
                noUnit
                digitTxtStyle={{ color: "#fff", fontWeight: "500" }}
                timeToShow={["S"]}
                timeLabels={{ s: null }}
              />
            ) : null}
          </TouchableOpacity>
        ) : (
          <GradBtn
            label={language?.next}
            width="90%"
            height={50}
            top={10}
            // style={{ position: "absolute", bottom: 40 }}
            // onPress={next}
            onPress={next}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: hp(20),
    width: "95%",
    alignSelf: "center",
    // justifyContent: "center",
    backgroundColor: "#fff",
    // marginTop: 20,
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
