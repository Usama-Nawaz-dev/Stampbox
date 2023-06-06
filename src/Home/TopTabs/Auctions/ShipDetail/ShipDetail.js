import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { GradBtn } from "../../../../../components";

import { light as theme } from "../../../../../constant/colorsConfig";
import { ShippingDetails } from "./ShippingDetails";
import ErrorMessage from "../../../../forms/ErrorMessage";
import InputsRow from "../../../../Store/StoreStamp/InputsRow";
import locals from "./locals";
import { useDispatch, useSelector } from "react-redux";
import Helper from "../../../../Helper";
import MindAxios from "../../../../../api/MindAxios";
import Env from "../../../../../api/Env";
import { SimpleHeader } from "../../../../../components";
import AuthContext from "../../../../Context/AuthContext";



export const ShipDetail = ({ navigation, route }) => {
  const { item: currentItem } = route.params;
  const { myState: {language}}=useContext(AuthContext);
  // const { item } = route.params;

  console.log("route from", currentItem);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  // console.log("route to", currentUser);

  const shipTo = {
    userName: currentUser?.full_name,
    phone: currentUser?.phone,
    email: currentUser?.email,
  }
  const adressTo = {
    address: currentUser?.addresses[0]?.address,
    city: currentUser?.addresses[0]?.city,
    state: currentUser?.addresses[0]?.state,
    zipcode: currentUser?.addresses[0]?.zipcode,
    country: currentUser?.addresses[0]?.country,
  }

  useEffect(() => {

    setValues2(shipTo)
    setAddress2(adressTo)
    fetchSenderDetail();

  }, [])

  const fetchSenderDetail = async () => {
    let { user_id } = currentItem;
    // console.log("id--->", user_id);
    if (user_id) {
      const response = await MindAxios.get(Env.paramUrl("users", user_id));
      // console.log("user res--->", response);
      if (response?.status == 200) {
        const {
          data: {
            result: { user },
          },
        } = response;
        // console.log("user---->", user);
        const {
          full_name: name_to,
          email: email_to,
          phone: phone_to,
        } = user;

        // console.log("kkkakh....", phone_to)

        const adressFrom = {
          address: user?.addresses[0]?.address,
          city: user?.addresses[0]?.city,
          state: user?.addresses[0]?.state,
          zipcode: user?.addresses[0]?.zipcode,
          country: user?.addresses[0]?.country,

        }
        // console.log("adress From.....", adressFrom); 
        const shipFrom = {
          userName: name_to,
          phone: phone_to,
          email: email_to,
        };
        setAddress(adressFrom);
        setValues(shipFrom);
      } else {
        await Helper.showToastMessage("Something went wrong", "red");
      }
    }
  }



  const [newValues, setNewVal] = useState(locals.initialNewValues);
  const [values, setValues] = useState(locals.initialVal);
  const [phoneError, setPhoneErr] = useState(false);
  const [phoneError_2, setPhoneErr_2] = useState(false);
  const [errMsgs, setErrMsgs] = useState({});
  const [errMsgs2, setErrMsgs2] = useState({});
  const [address, setAddress] = useState(locals.initialAddress);
  

  const [values2, setValues2] = useState(locals.initialVal);
  const [address2, setAddress2] = useState(locals.initialAddress);
  const dispatch = useDispatch();
  const vals = {
    newValues,
    values,
    values2,
    address,
    address2,
    navigation,
    currentItem,
    phoneError,
    phoneError_2,
  };

  const handleError = (error, input, num) => {
    if (num !== undefined) {
      setPhoneErr(true);
    } else {
      setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
    }
  };
  const handleError2 = (error, input, num) => {
    if (num !== undefined) {
      setPhoneErr_2(true);
    } else {
      setErrMsgs2((errMsgs2) => ({ ...errMsgs2, [input]: error }));
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <SimpleHeader title='Shipping Detail'
        onPressBack={() => navigation.goBack()} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: "90%",
            alignSelf: "center",
          }}
        >
          <InputsRow
            theme={theme}
            title={language?.parcelDetails+"*"}
            label1={language?.weight+"("+language?.pounds+")"}
            label2={language?.Length+"(cm)"}
            label3={language?.Height+"(cm)"}
            label4={language?.Width+"(cm)"}
            value1={newValues.weight}
            value2={newValues.length}
            value3={newValues.height}
            value4={newValues.width}
            onChange1={(text) => {
              handleError(null, "parcelErrMessage");
              setNewVal({ ...newValues, weight: text });
            }}
            onChange2={(text) => {
              handleError(null, "parcelErrMessage");
              setNewVal({ ...newValues, length: text });
            }}
            onChange3={(text) => {
              handleError(null, "parcelErrMessage");
              setNewVal({ ...newValues, height: text });
            }}
            onChange4={(text) => {
              handleError(null, "parcelErrMessage");
              setNewVal({ ...newValues, width: text });
            }}
          />
          <ErrorMessage
            visible={errMsgs.parcelErrMessage ? true : false}
            error={errMsgs.parcelErrMessage}
          />
          <ShippingDetails
            label="Shipping From"
            values={values}
            setValues={setValues}
            errMsgs={errMsgs}
            address={address}
            setAddress={setAddress}
            handleError={handleError}
            theme={theme}
            phoneError={phoneError}
            setPhoneErr={setPhoneErr}
          />
          <ShippingDetails
            label="Shipping to"
            values={values2}
            setValues={setValues2}
            errMsgs={errMsgs2}
            address={address2}
            setAddress={setAddress2}
            handleError={handleError2}
            theme={theme}
            phoneError={phoneError_2}
            setPhoneErr={setPhoneErr_2}
          />

          <GradBtn
            label="Continue"
            //   loading={loading}
            height={50}
            onPress={() => {
              locals.checkValidations(
                handleError,
                handleError2,
                dispatch,
                vals,
                language
              );
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
