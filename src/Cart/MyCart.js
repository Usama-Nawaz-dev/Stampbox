import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { MainHeader } from "../../components";
import { SwitchScreens } from "./index";
import { styles } from "./styles";

import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Helper from "../Helper";
import {
  popNavigation,
  pushNavigation,
} from "../../constant/navigationMethods";
import localFuncs from "./localFuncs";
import { languages } from "../../constant/staticData";
import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";
let initialVal = {
  userName: "",
  phone: "",
  email: "",
};
let initialAddress = {
  address: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
};
export const MyCart = (props) => {
  // console.log("props", props)
  const [screen, setScreen] = useState(0);
  const [values, setValues] = useState(initialVal);
  const [phoneError, setPhoneErr] = useState(false);
  const [errMsgs, setErrMsgs] = useState({});
  const [address, setAddress] = useState(initialAddress);

  const [values2, setValues2] = useState(initialVal);
  const [phoneError2, setPhoneErr2] = useState(false);
  const [errMsgs2, setErrMsgs2] = useState({});
  const [address2, setAddress2] = useState(initialAddress);
  const [show, setShow] = useState(true);
  const [same, setSame] = useState(true);

  const [cart_items, setCart_items] = useState(null);
  const [cart_store, setCart_store] = useState(null);
  const [body, setBody] = useState(null);
  const [rates, setRates] = useState(null);
  const [nullCart, setNullCart] = useState(null);
  const [cartKey, setCartKey] = useState(0);

  const handleError = (error, input, num) => {
    if (num !== undefined) {
      setPhoneErr(true);
    } else {
      setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
    }
  };

  const handleError2 = (error, input, num) => {
    if (num !== undefined) {
      setPhoneErr2(true);
    } else {
      setErrMsgs2((errMsgs2) => ({ ...errMsgs2, [input]: error }));
    }
  };

  const params = {
    values,
    phoneError,
    errMsgs,
    address,
    screen,
    setValues,
    setPhoneErr,
    setErrMsgs,
    setAddress,
    setScreen,
    handleError,
    cartData: cart_items,
    setCart_items,
    navigation: props.navigation,
    cartKey,
    cart_store,
    rates,
    setRates,
    body,
    setBody,
    values2,
    phoneError2,
    errMsgs2,
    address2,
    nullCart,
    setNullCart,
    setValues2,
    setPhoneErr2,
    setErrMsgs2,
    setAddress2,
    handleError2,
    show,
    setShow,
    same,
    setSame,
    // keyCount
  };
  const user = useSelector((state) => state.ApiReducer.user);
  const cart = useSelector((state) => state.DataReducer.cart);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  if (user) {
    var {
      first_name: name_from,
      last_name: last_from,
      email: email_from,
      phone: phone_from,
      addresses: addressFrom,
    } = user;
  }

  const getAddress = addressFrom?.length ? addressFrom[0] : initialAddress;

  const ship = {
    userName: `${name_from} ${last_from ? last_from : ""}`,
    email: email_from,
    phone: phone_from,
  };
  // const to_address = {
  //   ...getAddress,
  //   name: name_from,
  //   email: email_from,
  //   phone: phone_from,
  // };
  // console.log("toAddress", to_address);
  useFocusEffect(
    useCallback(() => {
      (async () => {
        // let cart = await Helper.getObj("cart");
        // console.log("cart--->", cart);
        setAddress(getAddress);
        setValues(ship);
        setAddress2(getAddress);
        setValues2(ship);
        setScreen(0);
        if (cart?.length > 0) {
          let myCart = localFuncs.deformCart(cart);
          setCart_items(myCart?.myObj);
          setCartKey(myCart?.keyCount);
        } else {
          setCart_items(null);
          setCartKey(0);
        }
      })();
      return () => {};
    }, [cart])
  );

  const getTitle = () => {
    if (screen == 0) {
      return "My Cart";
    } else if (screen == 1) {
      return "Shipping Details";
    } else if (screen == 2) {
      return "Shipping Rates";
    } else {
      return language?.billingDetails;
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={getTitle()}
        // onPressBack={() => popNavigation()}
        onPressBack={() => props.navigation.goBack()}
      />
      <SwitchScreens {...params} />
    </View>
  );
};
