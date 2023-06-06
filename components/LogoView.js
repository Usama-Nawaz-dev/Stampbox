import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import Image from "react-native-fast-image";

import AppText from "./AppText";
import Fonts from "../assets/fonts/Fonts";
import { images } from "../assets/images/Images";
import ThemeContext from "../src/Context/ThemeContext";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const LogoView = ({ label, height }) => {
  const { theme, mode } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { height: height }]}>
      <Image
        resizeMode="contain"
        source={mode == "dark" ? images.AppLogoDark : images.AppLogo}
        // source={mode == 'dark' ? images.LogoDark : images.Logo}
        style={{ width: 150, height: 150 }}
      />
      {label && (
        <AppText
          style={{
            fontSize: 18,
            marginTop: hp(2),
            color: theme.darkGrey,
            fontFamily: Fonts.IBM_Medium,
          }}
        >
          {label}
        </AppText>
      )}
    </View>
  );
};

export default LogoView;

const styles = StyleSheet.create({
  container: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
});
