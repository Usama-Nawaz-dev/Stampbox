import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { MainHeader } from "../../../../components";
import { WebView } from "react-native-webview";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";

export function TermsConditionScreen(props) {
  const { theme } = useContext(ThemeContext);
  const Webview = () => {
    return (
      <WebView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: theme?.white}}
        source={{
          uri: `https://development.stampbox.com/terms-and-conditions`,
        }}
      />
    );
  };
  return (
    <>
      <MainHeader
        title="Terms & Conditions"
        onPressBack={() => props.navigation.goBack()}
      />
      <Webview />
    </>
  );
}

const styles = StyleSheet.create({});
