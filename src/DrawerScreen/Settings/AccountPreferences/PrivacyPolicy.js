import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { MainHeader } from "../../../../components";
import { WebView } from "react-native-webview";
import ThemeContext from "../../../Context/ThemeContext";

export function PrivacyPolicy(props) {
  const { theme }= useContext(ThemeContext);
  const Webview = () => {
    return (
      <WebView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: theme?.white}}
        source={{
          uri: `https://development.stampbox.com/privacy-policy`,
        }}
      />
    );
  };
  return (
    <>
      <MainHeader
        title="Privacy Policy"
        onPressBack={() => props.navigation.goBack()}
      />
      <Webview />
    </>
  );
}

const styles = StyleSheet.create({});
