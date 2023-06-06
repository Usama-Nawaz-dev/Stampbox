import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import colors from "../constant/colors";
import Entypo from "react-native-vector-icons/Entypo";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import AppText from "./AppText";

const InputLabel = ({
  label,
  info,
  input,
  setInput,
  placeholder,
  star,
  top,
  height,
  bottom,
  numeric,
  onChangeText
}) => {
  return (
    <View style={[styles.itemPicker, { marginTop: top ? top : null }]}>
      <AppText style={styles.inputText}>
        {label}
        {star && <Text style={{ color: "red" }}>*</Text>}{" "}
        {info && (
          <Entypo name="info-with-circle" size={14} color={colors.theme} />
        )}
      </AppText>
      <View
        style={{
          height: height ? height : 50,
          flexDirection: "row",
          marginBottom: bottom ? bottom : 15,
          borderRadius: 50,
          borderWidth: 0.5,
          borderColor: "grey",
        }}
      >
        <TextInput
          value={input}
          placeholder={placeholder}
          keyboardType={numeric ? "numeric" : "default"}
          returnKeyType={numeric ? 'done' : "default"}
          onChangeText={ onChangeText ? onChangeText : (text) => setInput(text)}
          style={{ width: "100%", marginHorizontal: 13, fontFamily: 'Roboto-Regular' }}
        />
      </View>
    </View>
  );
};

export default InputLabel;

const styles = StyleSheet.create({
  itemPicker: {
    paddingHorizontal: wp(3),
    // marginBottom: 0
  },
  inputText: {
    fontSize: 14,
    marginBottom: 5,
  },
});
