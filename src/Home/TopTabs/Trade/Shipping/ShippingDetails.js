import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FloatingInput, GradBtn, Phone } from "../../../../../components";
import AppText from "../../../../../components/AppText";
import GooglePlaces from "../../../../../components/GooglePlaces";
import colors from "../../../../../constant/colors";
import Feather from "react-native-vector-icons/Feather";
import Fonts from "../../../../../assets/fonts/Fonts";
import AuthContext from "../../../../Context/AuthContext";

export const ShippingDetails = (props) => {
  const {
    label,
    values,
    setValues,
    errMsgs,
    address,
    setAddress,
    handleError,
    theme,
    phoneError,
    setPhoneErr,
  } = props;
  const{myState: {language}}=useContext(AuthContext);
  // console.log('route', props)
  const [show, setShow] = useState({
    to: false,
    from: false,
  });
  function checkIcon() {
    if (label == "Shipping From") {
      return show.from;
    } else {
      return show.to;
    }
  }
  function showHide() {
    if (label == "Shipping From") {
      setShow({ ...show, from: !show.from });
    } else {
      setShow({ ...show, to: !show.to });
    }
  }
  return (
    <>
      {/* <AppText style={{ marginTop: 20, fontSize: 18, fontWeight: '500'}}>{label}</AppText> */}
      <TouchableOpacity
        onPress={showHide}
        style={{
          height: 35,
          width: "100%",
          //   flex: 0.4,
          borderRadius: 2,
          backgroundColor: "rgba(191, 191, 191, .2)",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 5,
          marginTop: 20,
        }}
      >
        <AppText
          style={[
            styles.inputText,
            {
              color: theme.davyGrey,
              top: 5,
              fontWeight: checkIcon() ? "500" : "normal",
            },
          ]}
        >
          {label}
        </AppText>
        <Feather
          name={checkIcon() ? "chevron-up" : "chevron-down"}
          size={20}
          style={{ marginTop: 3 }}
          color={theme.dovGray}
        />
      </TouchableOpacity>
      {checkIcon() ? (
        <>
          <FloatingInput
            label="User Name*"
            value={values.userName}
            autoCapitalize={"none"}
            onChangeText={(text) => {
              handleError(null, "userNameErrMessage");
              setValues({ ...values, userName: text });
            }}
            error={
              errMsgs.userNameErrMessage ? errMsgs.userNameErrMessage : false
            }
          />
          <FloatingInput
            label="Email"
            value={values.email}
            autoCapitalize={"none"}
            onChangeText={(text) => {
              handleError(null, "emailErrMessage");
              setValues({ ...values, email: text });
            }}
            error={errMsgs.emailErrMessage ? errMsgs.emailErrMessage : false}
          />
          {/* <FloatingInput
            label="Phone Number"
            value={values.phone}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={"phone-pad"}
            onChangeText={(text) => setValues({ ...values, phone: text })}
          /> */}
          <Phone
            phoneNumber={values.phone}
            setPhoneNumber={(number) => setValues({ ...values, phone: number })}
            error={phoneError}
            setError={setPhoneErr}
          />
          <GooglePlaces
            address={address?.address}
            setAddress={(address) => {
              // console.log('address', address)
              setAddress(address);
            }}
          />
          <FloatingInput
            label={language?.Town_City}
            value={address?.city?.toString()}
            marginTop={5}
            onChangeText={(text) =>
              setAddress({
                ...address,
                address: { city: text },
              })
            }
          />

          <FloatingInput
            label={language?.State_Province}
            value={address?.state?.toString()}
            onChangeText={(text) =>
              setAddress({
                ...address,
                state: text,
              })
            }
          />

          <FloatingInput
            label={language?.zipCode}
            value={address?.zipcode?.toString()}
            onChangeText={(text) =>
              setAddress({
                ...address,
                zipcode: text,
              })
            }
          />

          <FloatingInput
            label={language?.country}
            value={address?.country?.toString()}
            onChangeText={(text) =>
              setAddress({
                ...address,
                country: text,
              })
            }
          />
        </>
      ) : null}
    </>
  );
};
const styles = StyleSheet.create({
  inputText: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.btnText,
    fontFamily: Fonts.Roboto_Regular,
  },
});
