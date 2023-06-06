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

export default function SubmitButton({ loading, inputLabel, onPress, btnWidth,}) {
  const { handleSubmit } = useFormikContext();

  return loading ? (
    <View style={styles.indicator}>
      <ActivityIndicator
        size="large"
        color={colors.theme}
      />
    </View>
  ) : (
    <TouchableOpacity
      onPress={handleSubmit}
      style={[styles.button, { width: btnWidth ? btnWidth : undefined }]}>
      <LinearGradient
        colors={["#B45436", "#BF7259"]}
        style={[styles.button, { marginTop: 0, width: '100%' }]}
      >
        <AppText style={styles.text}>{inputLabel}</AppText>
        {/* {icon && <Icon
        name="right"
        size={12}
        style={{ color: "#FFF", marginHorizontal: 3 }}
      />} */}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    height: hp(5),
    width: hp(35),
    alignSelf: 'center',
    // backgroundColor: 'red',
    bottom: hp(-5)
  },
  button: {
    height: 50,
    borderRadius: 5,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: 'center'
  },
  text: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.cWhite,
    marginHorizontal: 5,
  },
});
