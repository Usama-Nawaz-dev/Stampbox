import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";

import { styles } from "./styles";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import GooglePlaces from "../../../components/GooglePlaces";

import {
  FloatingInput,
  GradBtn,
  SimpleHeader
} from "../../../components";

import { useSelector, useDispatch } from "react-redux";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";
import AuthContext from "../../Context/AuthContext";

export const EditAddress = (props) => {
  const dispatch = useDispatch();
  const checkAddress = useSelector(
    (state) => state.DataReducer.currentUser?.store?.addresses[0]
  );
  const currentUser = useSelector((state) => state.ApiReducer.user);
  // console.log(currentUser?.store?.addresses)
  const Address = currentUser?.store?.addresses[0];

  // const address = checkAddress !== undefined ? checkAddress : "";
  // console.log(address);

  const [address, setAddress] = useState({
    address: Address.address,
    city: Address.city,
    state: Address.state,
    zipcode: Address.zipcode,
    country: Address.country
  })
  const [errMsgs, setErrMsgs] = useState({});
  const {myState:{language}}=useContext(AuthContext);

  const handleError = (error, input) => {
    setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  };

  const checkValidations = async () => {
    let isValid = true;
    if (!address.address) {
      alert("Address is Required");
      isValid = false;
    }

    if (!address.city) {
      handleError("User is Required.", "cityErrMessage");
      isValid = false;
    }

    if (!address?.state) {
      handleError("State is Required.", "stateErrMessage");
      isValid = false
    }

    if (!address?.country) {
      handleError("Country is Required.", "countryErrMessage");
      isValid = false
    }

    if (isValid) {
      // console.log(Address.id)
      dispatch(allActions.DataAction.ActivityModal(true));
      let body = {
        address: address?.address?.address ?
          address?.address?.address :
          address?.address,
        city: address?.city,
        state: address?.state,
        zipcode: address?.zipcode,
        country: address?.country
      }
      const response = await MindAxios.post(
        // USER ADDRESS -> UPDATE
        Env.paramUrl("addresses", Address?.id),
        body
      );
      dispatch(allActions.DataAction.ActivityModal(false));
      if (response?.status == 200) {
        props.navigation.goBack();
      } else {
        alert(language?.serverError)
      }
    }
  };


  return (
    <View style={styles.container}>
      <SimpleHeader title="Edit Address" onPressBack={() => props.navigation.goBack()} />
      <KeyboardAwareScrollView>
        <View style={styles.inputsSection}>

          <GooglePlaces
            address={address?.address}
            setAddress={(address) => {
              setAddress({ ...address, address });
            }}
          />
          <FloatingInput
            label={language?.Town_City+"*"}
            value={address?.city?.toString()}
            onChangeText={(text) => {
              handleError(null, "cityErrMessage");
              setAddress({ ...address, city: text });
            }}
            error={errMsgs.cityErrMessage ? errMsgs.cityErrMessage : false}
          />

          <FloatingInput
            label={language?.State_Province+"*"}
            value={address?.state?.toString()}
            onChangeText={(text) => {
              handleError(null, "stateErrMessage");
              setAddress({ ...address, state: text });
            }}
            error={errMsgs.stateErrMessage ? errMsgs.stateErrMessage : false}
          />
          <FloatingInput
            label={language?.zipCode}
            value={address?.zipcode?.toString()}
            onChangeText={(text) => {
              setAddress({ ...address, zipcode: text });
            }}
          />

          <FloatingInput
            label={language?.country+"*"}
            value={address?.country?.toString()}
            onChangeText={(text) => {
              handleError(null, "countryErrMessage");
              setAddress({ ...address, country: text });
            }}
            error={errMsgs.countryErrMessage ? errMsgs.countryErrMessage : false}
          />
          <GradBtn label="Update" height={50}
            onPress={checkValidations} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
