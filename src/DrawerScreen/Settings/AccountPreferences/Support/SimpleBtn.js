import { Pressable, Text } from "react-native";
import React, { useContext } from "react";
import { styles } from "./styles";
import colors from "../../../../../constant/colors";
import Fonts from "../../../../../assets/fonts/Fonts";
import ThemeContext from "../../../../Context/ThemeContext";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const SimpleBtn = ({ title, onPress, bg, fontColor, style }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.rgbBtn,
        style,
        {
          backgroundColor: bg,
        },
      ]}
    >
      <Text style={{ color: fontColor, fontSize: 12 }}>{title}</Text>
    </Pressable>
  );
};
