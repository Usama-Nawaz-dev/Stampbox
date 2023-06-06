import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../constant/colors";

const Indicator = ({ label }) => {
  return (
    <View
      style={{
        height: 140,
        width: 300,
        backgroundColor: "#fff",
        position: "absolute",
        top: hp(36),
        borderRadius: hp(1),
        zIndex: 1000,
        alignSelf: "center",
        // alignItems: "center",
        // justifyContent: "center",
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.5, backgroundColor: "transparent" }}>
          <Text style={styles.textStyle}>Please Wait...</Text>
          <Text
            style={[styles.textStyle, { fontSize: 15, fontWeight: "normal" }]}
          >
            {label}...
          </Text>
        </View>
        <View
          style={{
            flex: 0.5,
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <ActivityIndicator
            size="large"
            color={colors.theme}
            style={{ margin: 10 }}
          />
        </View>
      </View>
    </View>
  );
};

export default Indicator;

const styles = StyleSheet.create({
  textStyle: {
    color: colors.theme,
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    // marginLeft: 10,
    // marginTop
  },
});
