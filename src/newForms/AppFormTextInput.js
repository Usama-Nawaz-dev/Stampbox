import React, { useContext } from "react"
import { StyleSheet, View, TextInput } from "react-native"
import AppText from "../AppText/AppText"
import colors from "../../config/colors"
import defaultStyles from "../../config/styles"
import AppLink from "../AppLink"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import AuthContext from "../Context/AuthContext"

export default function AppFormTextInput({
  label,
  password,
  setInput,
  value,
  forgetPassword,
  style,
}) {
  const {myState: {language}}= useContext(AuthContext);
  return (
    <View style={[styles.formControl, style]}>
      <AppText style={styles.text}>{label}</AppText>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          value={value}
          onChangeText={text => setInput(text)}
          secureTextEntry={password}
          style={[defaultStyles.textInput, { marginVertical: 5 }]}
        />
        {forgetPassword && <AppLink>{language?.forgotPassword}</AppLink>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  formControl: {
    borderBottomWidth: hp("0.04%"),
    borderBottomColor: colors.label,
    marginBottom: hp("2%"),
  },
  text: {
    color: colors.label,
    fontSize: hp("1.60%"),
    textTransform: "uppercase",
  },
})
