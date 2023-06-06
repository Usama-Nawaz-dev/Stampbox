import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

import { MainHeader } from "../../components";

export const PrivacyPolicy = (props) => {
  const { termsSheetRef, isPolicy } = props.route.params;
  return (
    <View style={{ flex: 1 }}>
      <MainHeader
        title={isPolicy ? "Privacy Policy" : "Terms and Conditions"}
        onPressBack={() => {
          termsSheetRef?.current?.open();
          props.navigation.goBack();
        }}
      />
      <WebView
        source={{
          uri: `https://development.stampbox.com/${
            isPolicy ? "privacy-policy" : "terms-and-conditions"
          }/`,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "yellow",
  },
});
