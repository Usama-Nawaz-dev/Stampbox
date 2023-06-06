import React from "react";
import { View } from "react-native";
import colors from "../constant/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const LineSaperator = () => {
  return (
    <View
      style={{ backgroundColor: colors.bgLight, height: 1, width: wp(90), marginTop: 10, alignSelf: 'center'}}
    />
  );
};

export { LineSaperator };
