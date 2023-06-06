import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import HeaderWithIcons from "../../../../../components/HeaderWithIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { GradBtn, SimpleHeader } from "../../../../../components";
import { light as theme } from "../../../../../constant/colorsConfig";
import { ShippingDetails } from "./ShippingDetails";
import ErrorMessage from "../../../../forms/ErrorMessage";
import InputsRow from "../../../../Store/StoreStamp/InputsRow";
import locals from "./locals";
import { useDispatch, useSelector } from "react-redux";
import Helper from "../../../../Helper";
import MindAxios from "../../../../../api/MindAxios";
import Env from "../../../../../api/Env";
import AuthContext from "../../../../Context/AuthContext";
export const TradeShip = ({ navigation, route }) => {
  const { item: currentItem, media_url } = route.params;
  // const { item } = route.params;

  // console.log("route", media_url);
  const {
    first_name: name_from,
    last_name: last_from,
    email: email_from,
    phone: phone_from,
    addresses: addressFrom,
  } = useSelector((state) => state.ApiReducer.user);
  const getFromAddress = addressFrom?.length
    ? addressFrom[0]
    : locals.initialAddress;

  const shipFrom = {
    userName: `${name_from} ${last_from}`,
    email: email_from,
    phone: phone_from,
  };
  // const shipTo = {username: full_name, email: email, phone: phone, address: {}};

  // console.log("shipfrom", shipFrom);

  const [newValues, setNewVal] = useState(locals.initialNewValues);
  const [values, setValues] = useState(locals.initialVal);
  const [phoneError, setPhoneErr] = useState(false);
  const [phoneError_2, setPhoneErr_2] = useState(false);
  const [errMsgs, setErrMsgs] = useState({});
  const [errMsgs2, setErrMsgs2] = useState({});
  const [address, setAddress] = useState(locals.initialAddress);
  const { myState: {language}}=useContext(AuthContext);

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
    media_url
  };

  useEffect(() => {
    (async () => {
      // console.log('id--->', userId)
      let { user_id } = currentItem;
      if (user_id) {
        const response = await MindAxios.get(Env.paramUrl("users", user_id));
        // console.log("user res--->", response);
        if (response?.status == 200) {
          const {
            data: {
              result: { user },
            },
          } = response;
          const {
            first_name: name_to,
            last_name: last_to,
            email: email_to,
            phone: phone_to,
            addresses: addressTo,
          } = user;
          const getToAddress = addressTo?.length
            ? addressTo[0]
            : locals.initialAddress;
          const shipTo = {
            userName: `${name_to} ${last_to}`,
            phone: phone_to,
            email: email_to,
          };
          // console.log("getToAddress", getToAddress);
          // console.log("getFromAddress", getFromAddress);
          // setAddress(getFromAddress);
          // setValues(shipFrom);
          // setAddress2(getToAddress);
          // setValues2(shipTo);
          setAddress(getToAddress);
          setValues(shipTo);
          setAddress2(getFromAddress);
          setValues2(shipFrom);

          // const shipTo = {
          //   username: `${name_to} ${last_to}`,
          //   email: email_to,
          //   phone: phone_to,
          //   address: getToAddress,
          // };
        } else {
          await Helper.showToastMessage("Something went wrong", "red");
        }
      }
    })();
  }, []);
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
      <SimpleHeader
        title="Shipping Details"
        onPressBack={() => navigation.goBack()}
      />
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
            setErrMsgs={setErrMsgs}
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
            setErrMsgs={setErrMsgs2}
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
                vals
              );
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
