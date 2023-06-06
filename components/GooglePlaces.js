import React, { useState, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
} from "react-native";
import AppText from "./AppText";
import Helper from "../src/Helper";
import Fonts from "../assets/fonts/Fonts";
import ThemeContext from "../src/Context/ThemeContext";
import { FloatingInput } from "./FloatingInput";
const GooglePlaces = (props) => {
  const { width, address, setAddress, label } = props;
  const [dataSource, setDataSource] = useState([]);
  const [focused, setFocused] = useState(false);
  const { theme, mode } = useContext(ThemeContext);
  const _onBlur = () => {
    setFocused(false);
  };



  const dataSetter = (text) => {
    if (text.length) {
      let url =
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=` +
        encodeURIComponent(text) +
        "&" +
        "key=AIzaSyAyaPcWxz6hHMdJZhwu0hr820gJrE1l3lY&components=country%3Aus";
      Helper._request(url, false, setDataSource);
    }
  };

  const _address = (item) => {
    let placeId = item?.place_id;
    let description = item?.description;
    if (placeId) {
      let url = `https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyAyaPcWxz6hHMdJZhwu0hr820gJrE1l3lY&placeid=${placeId}&language=en`;
      Helper._request(url, true, setAddress, _onBlur, description);
      // setAddress(item?.description)
    }
  };
  return (
    <View
      style={{
        height: focused ? 250 : 50,
        width: width ? width : "100%",
        alignSelf: "center",
        marginBottom: focused ? -5 : 10,
        marginTop: 5,
      }}
    >
      <FloatingInput
        value={address?.address ? address?.address : address}
        label={label ? label : "Address"}
        onBlur={_onBlur}
        onChangeText={(val) => {
          setAddress(val);
          if (val.length > 0) {
            setFocused(true);
            dataSetter(val);
          } else {
            setFocused(false);
          }
        }}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dataSource}
        keyExtractor={()=> Helper.keyGenerator()}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: theme.lightGrey,
              width: "100%",
              alignSelf: "center",
              marginVertical: 3,
            }}
          />
        )}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => _address(item)}
            style={{
              height: 50,
              width: "100%",
              alignSelf: "center",
              marginTop: 10,
            }}
          >
            <AppText style={{ color: theme.davyGrey, fontWeight: "600", fontFamily: Fonts.Roboto_Regular }}>
              {item?.structured_formatting?.main_text}
            </AppText>
            <AppText numberOfLines={2} style={{ color: theme.davyGrey, fontFamily: Fonts.Roboto_Regular }}>
              {item?.structured_formatting?.secondary_text}
            </AppText>
          </Pressable>
        )}
      />
    </View>
  );
};

export default GooglePlaces;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    width: "100%",
    alignSelf: "center",
    fontSize: 14,
    fontFamily: "Roboto-Regular",
  },
  animatedStyle: {
    position: "absolute",
    borderRadius: 90,
    zIndex: 10000,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.Roboto_Regular,
  },
});


{/* <TextInput
style={[styles.input, {
  borderColor: current ? theme.theme : theme.lightGrey,
  color: theme.davyGrey
}]}
ref={ref_input}
// onChangeText={onChangeNumber}
onChangeText={(val) => {
  setAddress(val);
  if (val.length > 0) {
    setFocused(true);
    dataSetter(val);
  } else {
    setFocused(false);
  }
}}
onFocus={() => {
  onFocusHandler();
}}
onBlur={_onBlur}
value={address?.address ? address?.address : address}
// keyboardType="numeric"
/> */}