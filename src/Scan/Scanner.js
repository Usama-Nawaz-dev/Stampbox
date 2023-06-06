import React from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";


export const Scanner = (props) => {
  const { backgroundColor, visible, testID, loading } = props;
//   const loading = useSelector((state) => state.DataReducer.show_loader);
  return loading ? (
    <View
      style={{
        // flex: 1,
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        // backgroundColor: backgroundColor
        //   ? backgroundColor
        //   : "rgba(0, 0, 0, 0.4)",
      }}
    >
      <LottieView source={require("../../assets/jsons/scanner.json")} autoPlay loop />
    </View>
  ) : null;
};
