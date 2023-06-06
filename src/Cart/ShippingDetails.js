import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppText from "../../components/AppText";
import Feather from "react-native-vector-icons/Feather";
import Checkbox from "react-native-vector-icons/MaterialCommunityIcons";
import { FloatingInput, Phone } from "../../components";
import GooglePlaces from "../../components/GooglePlaces";
import Fonts from "../../assets/fonts/Fonts";
import colors from "../../constant/colors";
import AuthContext from "../Context/AuthContext";

const ShippingDetails = (props) => {
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
    setErrMsgs,
    show,
    setShow,
    same,
    setSame,
  } = props;
  const {myState: {language}}=useContext(AuthContext);
  // console.log('route', props)
  //   const [show, setShow] = useState({
  //     to: true,
  //     from: false,
  //   });
  //   function show {
  //     if (label == "Billing Details") {
  //       return show.from;
  //     } else {
  //       return show.to;
  //     }
  //   }
  //   function showHide() {
  //     if (label == "Billing Details") {
  //       setShow({ ...show, from: !show.from });
  //     } else {
  //       setShow({ ...show, to: !show.to });
  //     }
  //   }
  let initialAddress = {
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  };
  return (
    <View style={{ flex: 1 }}>
      {/* <AppText style={{ marginTop: 20, fontSize: 18, fontWeight: '500'}}>{label}</AppText> */}
      {/* <TouchableOpacity
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
          // marginBottom: label == ,
        }}
      >
        <AppText
          style={[
            styles.inputText,
            {
              color: theme?.davyGrey,
              top: 5,
              fontWeight: show ? "500" : "normal",
            },
          ]}
        >
          {label}
        </AppText>
        <Feather
          name={show ? "chevron-up" : "chevron-down"}
          size={20}
          style={{ marginTop: 3 }}
          color={theme?.dovGray}
        />
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => {
          if (show !== undefined) {
            setShow(!show);
          }
        }}
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
          // marginBottom: label == ,
        }}
      >
        <AppText
          style={[
            styles.inputText,
            {
              color: theme?.davyGrey,
              top: 5,
              fontWeight: show ? "500" : "normal",
            },
          ]}
        >
          {label}
        </AppText>
        {label == "Billing Details" ? (
          <View style={{ flexDirection: "row" }}>
            <AppText
              style={[
                styles.inputText,
                {
                  color: theme?.davyGrey,
                  top: 5,
                  fontWeight: !show ? "500" : "normal",
                  marginRight: 5,
                },
              ]}
            >
              same as above
            </AppText>
            <Checkbox
              name={!show ? "checkbox-marked" : "checkbox-blank-outline"}
              size={20}
              style={{ marginTop: 3 }}
              color={show ? theme?.dovGray : theme?.theme}
            />
          </View>
        ) : (
          <Feather
            name={show ? "chevron-up" : "chevron-down"}
            size={20}
            style={{ marginTop: 3 }}
            color={theme?.dovGray}
          />
        )}
      </TouchableOpacity>
      {show == undefined || show ? (
        <>
          <FloatingInput
            label={language?.name+"*"}
            value={values.userName}
            autoCapitalize={"none"}
            onChangeText={(text) => {
              handleError(null, "userNameErrMessage");
              setValues({ ...values, userName: text });
            }}
            error={
              errMsgs?.userNameErrMessage ? errMsgs?.userNameErrMessage : false
            }
          />
          <FloatingInput
            label={language?.email}
            value={values.email}
            autoCapitalize={"none"}
            onChangeText={(text) => {
              handleError(null, "emailErrMessage");
              setValues({ ...values, email: text });
            }}
            error={errMsgs?.emailErrMessage ? errMsgs?.emailErrMessage : false}
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
              console.log("address", address);
              if (!address) {
                // console.log("no address")
                setAddress(initialAddress);
              } else {
                setAddress(address);
                setErrMsgs(null);
              }
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
            error={errMsgs?.cityErrMessage ? errMsgs?.cityErrMessage : false}
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
            error={errMsgs?.stateErrMessage ? errMsgs?.stateErrMessage : false}
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
            error={errMsgs?.zipErrMessage ? errMsgs?.zipErrMessage : false}
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
            error={
              errMsgs?.countryErrMessage ? errMsgs?.countryErrMessage : false
            }
          />
        </>
      ) : null}
    </View>
  );
};
export { ShippingDetails };
const styles = StyleSheet.create({
  inputText: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.btnText,
    fontFamily: Fonts.Roboto_Regular,
  },
});
