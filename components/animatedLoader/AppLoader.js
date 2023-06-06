import React from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export const AppLoader = (props) => {
  const { backgroundColor, visible, testID } = props;
  const loading = useSelector((state) => state.DataReducer.show_loader);
  return loading ? (
    <View
      testID={testID}
      style={{
        // flex: 1,
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: backgroundColor
          ? backgroundColor
          : "rgba(0, 0, 0, 0.4)",
      }}
    >
      <LottieView source={require("./animatedLoader.json")} autoPlay loop />
    </View>
  ) : null;
};
