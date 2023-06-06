import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MainHeader } from "../../components";
import WebView from "react-native-webview";
import { useDispatch } from "react-redux";
import allActions from "../../redux/actions";

const ActivatePayment = (props) => {
  const { onBoardUrl } = props.route?.params;
  console.log("props", onBoardUrl);
  const dispatch = useDispatch();
  const handleNavigationStateChange = (navState) => {
    console.log("navState.url", navState.url);
    if (navState.url !== onBoardUrl) {
      dispatch(allActions.DataAction.ActivityModal(false));
      props.navigation.goBack();
      // dispatch(allActions.DataAction.ActivityModal(false));
    }
    // setCurrentUrl(navState.url);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <MainHeader
        title="Activate Payment"
        onPressBack={() => props.navigation.goBack()}
      />
      {onBoardUrl ? (
        <WebView
          onLoadStart={() =>
            dispatch(allActions.DataAction.ActivityModal(true))
          }
          onLoadEnd={() => dispatch(allActions.DataAction.ActivityModal(false))}
          source={{
            uri: onBoardUrl,
          }}
          onNavigationStateChange={handleNavigationStateChange}
        />
      ) : null}
    </View>
  );
};

export { ActivatePayment };

const styles = StyleSheet.create({});
