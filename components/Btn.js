import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import colors from "../constant/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import AppText from "./AppText";
import Fonts from "../assets/fonts/Fonts";

const Btn = (props) => {
  const {
    label,
    icon,
    loading,
    width,
    height,
    onPress,
    fontSize,
    style,
    textColor,
    iconLeft,
    fontWeight,
    textStyle,
    bg,
  } = props;
  return loading ? (
    <View style={styles.indicator}>
      <ActivityIndicator
        // style={{ bottom: hp(-1) }}
        size="large"
        color={colors.theme}
      />
    </View>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          height: height !== undefined ? height : 60,
          width: width !== undefined ? width : "90%",
          borderRadius: 5,
          backgroundColor: bg ? bg : colors.color8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          // alignSelf: "center",
        },
        style,
      ]}
    >
      {iconLeft}
      {label && (
        <AppText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            {
              fontSize: fontSize !== undefined ? fontSize : 18,
              fontWeight: fontWeight ? fontWeight : "600",
              color: textColor ? textColor : colors.cWhite,
              marginHorizontal: iconLeft ? 5 : 10,
              fontFamily: Fonts.Inter_Regular,
            },
            textStyle,
          ]}
        >
          {label}
        </AppText>
      )}
      {icon}
    </TouchableOpacity>
  );
};

export default Btn;

const styles = StyleSheet.create({
  indicator: {
    height: hp("5%"),
    width: hp("35%"),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: 'red',
    // bottom: hp(-5)
  },
});
