import React from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useFormikContext } from "formik";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import LinearGradient from "react-native-linear-gradient";

export default function SubmitButton({ loading, inputLabel, onPress, btnWidth, icon = true, theme }) {
  const { handleSubmit } = useFormikContext();

  return loading ? (
    <View style={styles.indicator}>
      <ActivityIndicator
        size="large"
        color={colors.theme}
      />
    </View>
  ) : (
    <LinearGradient
      colors= {theme ? theme?.themeGrad : ["#B45436", "#BF7259"]}
        style={[styles.button, { width: btnWidth ? btnWidth : undefined }]}>
      <TouchableOpacity 
        onPress={handleSubmit}
        style={[styles.button,{marginTop: 0, width: '100%'}]}
        >
        <AppText style={[styles.text, { color: theme ? theme?.white : '#000'}]}>{inputLabel}</AppText>
        {/* {icon && <Icon
        name="right"
        size={12}
        style={{ color: "#FFF", marginHorizontal: 3 }}
      />} */}
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    height: hp('5%'),
    width: hp('35%'),
    alignSelf: 'center',
    // backgroundColor: 'red',
    bottom: hp(-5)
  },
  button: {
    height: 50,
    borderRadius: 5,
    // backgroundColor: "#BA4D3E",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: "#FFF",
    marginHorizontal: 5,
  },
});
