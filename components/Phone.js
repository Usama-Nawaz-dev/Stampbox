import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import ReactNativePhoneInput from "react-native-phone-input";
import { light as theme } from "../constant/colorsConfig";
import AntDesign from "react-native-vector-icons/AntDesign";
import Fonts from "../assets/fonts/Fonts";
import ThemeContext from "../src/Context/ThemeContext";
// import { dark as theme } from "../constant/colorsConfig";

const Phone = (props) => {
  const { phoneNumber, setPhoneNumber, error, setError } = props;
  const [isFocused, setFocus] = useState(false);
    const { theme, mode } = useContext(ThemeContext);

  const phoneRef = useRef(null);
  useEffect(
    () => {
      if (phoneNumber?.length > 7) {
        // console.log(debouncedSearchTerm.length)
        const isValid = phoneRef.current?.isValidNumber();
        // console.log("isVlaid", isValid);
        setError(!isValid);
      }
    },
    [phoneNumber] // Only call effect if debounced search term changes
  );

  const handleSubmit = () => {
    const isValid = phoneRef.current?.isValidNumber();
    let val = phoneRef.current?.getValue();
    return isValid;
  };

  return (
    <View style={{ width: "100%", alignSelf: "center", marginTop: 15 }}>
      <ReactNativePhoneInput
        // style={{ width: "88%" }}
        flagStyle={{height: 15, width: 20, resizeMode: 'cover'}}
        // textStyle={styles.phoneInputTextStyle}
        ref={phoneRef}
        onBlur={() => {
          // console.log("on Blurr ");
          setFocus(false);
        }}
        onFocus={() => {
          // console.log("on Focus ");
          setFocus(true);
        }}
        onChangePhoneNumber={(text) => {
          // console.log("input", text);
          setPhoneNumber(text);
        }}
        initialCountry={"us"}
        initialValue={phoneNumber}
        textProps={{
          placeholder: "PhoneNumber...",
        }}
        //Text style
        textStyle={{ color: theme?.black }}
      />
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: isFocused ? theme.theme : theme.lightGrey,
          top: 10,
        }}
      />
      {error && (
        <View style={styles.error}>
          <AntDesign name="infocirlce" color={theme.red} size={12} />
          <Text style={[styles.errorText, { color: theme.red }]}>
            Please enter a valid phone-number
          </Text>
        </View>
      )}
    </View>
  );
};

export { Phone };
const styles = StyleSheet.create({
  input: {
    height: 30,
    fontSize: 14,
    fontFamily: Fonts.Roboto_Regular,
    borderBottomWidth: 1,
  },
  error: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 5,
    top: 15,
    alignSelf: "flex-end",
  },
  errorText: {
    fontSize: 12,
    marginLeft: 5,
    fontFamily: Fonts.Roboto_Regular,
  },
  eye: {
    position: "absolute",
    alignSelf: "flex-end",
    bottom: 10,
    right: 10,
  },
});
