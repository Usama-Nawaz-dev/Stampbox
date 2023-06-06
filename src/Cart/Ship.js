import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { light } from "../../constant/colorsConfig";
import { styles } from "./styles";
import AntDesign from "react-native-vector-icons/AntDesign";
import Btn from "../../components/Btn";
import AppText from "../../components/AppText";
import { useDispatch, useSelector } from "react-redux";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import allActions from "../../redux/actions";
import localFuncs from "./localFuncs";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { ShippingDetails } from "./ShippingDetails";
import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";
import Helper from "../Helper";

const { width } = Dimensions.get("window");
const Ship = (props) => {
  const {
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
    cartData,
    cart_store,
    rates,
    nullCart,
    setRates,
    setNullCart,
    values2,
    phoneError2,
    errMsgs2,
    address2,
    setValues2,
    setPhoneErr2,
    setErrMsgs2,
    setAddress2,
    handleError2,
    show,
    setShow,
    same,
    setSame,
  } = props;
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.DataReducer.cart);
  let total = 0;
  cart?.forEach((item) => {
    total += item?.sale_price;
  });
  const checkValidations = (vals, checkError, phone_Error, add_ress) => {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!vals.userName) {
      checkError("User name is Required.", "userNameErrMessage");
      return false;
    }
    if (!vals.phone?.length) {
      checkError("", "", "phone");
      return false;
    }
    if (vals.phone?.length < 7 || phone_Error) {
      checkError("", "", "phone");
      return false;
    }

    if (!vals.email) {
      checkError(language?.email_is_missing, "emailErrMessage");
      return false;
    }
    if (reg.test(vals.email) == false) {
      checkError(language?.please_enter_valid_email, "emailErrMessage");
      return false;
    }
    if (!add_ress.city) {
      checkError("city is Missing.", "cityErrMessage");
      return false;
    }
    if (!add_ress.state) {
      checkError("state is Missing.", "stateErrMessage");
      return false;
    }
    if (!add_ress.zipcode) {
      checkError("zipcode is Missing.", "zipErrMessage");
      return false;
    }
    if (!add_ress.country) {
      checkError("country is Missing.", "countryErrMessage");
      return false;
    }
    return true;
  };

  // const getRatesApi = () => {

  //   let unique = Helper.unique_array(cart, "store_id");
  //   console.log("unique", unique);
  // };
  const getRatesApi = async () => {
    console.log("show", show);
    if (!address) {
      alert("Please select an address");
      return;
    }
    if (show) {
      if (!address2) {
        alert("Please select billing address");
        return;
      }
      var check2 = checkValidations(
        values2,
        handleError2,
        phoneError2,
        address2
      );
      console.log("billing", check2);
      if (check2) {
        setErrMsgs2(null);
      }
    }

    let check = checkValidations(values, handleError, phoneError, address);
    console.log("check", check);
    if (check) {
      setErrMsgs(null);
      dispatch(allActions.DataAction.ActivityModal(true));
      let to_address = {
        ...address,
        name: values?.userName,
        email: values?.email,
        phone: values?.phone,
      };
      let unique = Helper.unique_array(cart, "store_id");
      let storeRates = [];
      let nullRates = [];
      for (let item of unique) {
        let body = {
          from_address: item?.from_address,
          to_address: to_address,
          parcels: [item?.parcel],
        };
        // console.log("store cart--->", body);
        const res = await MindAxios.post(
          Env.createUrl("shipments/generate-rates"),
          body
        );
        // console.log("store cart--->", res);
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
          storeRates.push(obj);
        } else {
          let obj = {};
          obj.id = item?.store_id;
          obj.rates = [];
          nullRates.push(item);
          storeRates.push(obj);
        }
      }
      dispatch(allActions.DataAction.ActivityModal(false));
      console.log("storeRates", storeRates);
      console.log("nullCart", nullRates);
      setNullCart(nullRates), setRates(storeRates);
      props.setScreen(2);
    }
  };

  return (
    <View style={{ flex: 1, width: "90%", alignSelf: "center" }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // contentContainerStyle={{ flex: 1 ,width: "90%", alignSelf: "center" }}
      >
        <View style={styles.topCard}>
          <Text>
            Quantity:{" "}
            <Text style={{ fontWeight: "600" }}>
              {cart?.length > 1
                ? `${cart?.length} items`
                : `${cart?.length ? cart?.length : 0} item`}
            </Text>
          </Text>
          <Text style={{ top: 10 }}>
            Subtotal:{" "}
            <Text style={{ fontWeight: "600", color: light.theme }}>
              ${total}.0
            </Text>
          </Text>
        </View>
        <View style={{ marginBottom: hp(15) }}>
          <ShippingDetails
            label="Shipping Details"
            values={values}
            setValues={setValues}
            errMsgs={errMsgs}
            address={address}
            setAddress={setAddress}
            handleError={handleError}
            theme={light}
            phoneError={phoneError}
            setPhoneErr={setPhoneErr}
            setErrMsgs={setErrMsgs}
            // show={show}
            // setShow={setShow}
          />
          <ShippingDetails
            label={language?.billingDetails}
            values={values2}
            setValues={setValues2}
            errMsgs={errMsgs2}
            address={address2}
            setAddress={setAddress2}
            handleError={handleError2}
            theme={light}
            phoneError={phoneError2}
            setPhoneErr={setPhoneErr2}
            setErrMsgs={setErrMsgs2}
            show={show}
            setShow={setShow}
          />
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          height: hp(10),
          position: "absolute",
          bottom: 0,
          // backgroundColor: "#fff",
          width: wp(100),
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Btn
          label="Confirm"
          // onPress={() => console.log("show", show)}
          onPress={getRatesApi}
          fontSize={14}
          height={45}
          icon={<AntDesign name="arrowright" color={"#fff"} size={20} />}
        />
      </View>
    </View>
  );
};

export { Ship };
