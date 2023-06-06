import React, { useContext } from "react";
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import FastImage from "react-native-fast-image";

import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import ThemeContext from "../../Context/ThemeContext";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import AppText from "../../../components/AppText";
import { images } from "../../../assets/images/Images";

export const EventHeader = (props) => {
  const { theme, mode } = useContext(ThemeContext);
  const { title, onPressBack, onPressCalendar, onPressAdd } = props;
  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <ImageBackground style={styles.bgImage} source={images.Header}>
        <View style={styles.topSection}>
          <View style={styles.titleSection}>
            <TouchableOpacity
              onPress={onPressBack}
              style={{ paddingHorizontal: wp(3) }}
            >
              <FastImage
                resizeMode="contain"
                source={images.ArrowLeft}
                style={{ height: hp(2.5), width: hp(1.2) }}
              />
            </TouchableOpacity>
            <AppText style={styles.titleText}>{title}</AppText>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity onPress={onPressAdd}>
              <Ionicons
                name="md-add-circle-outline"
                color={colors.cWhite}
                style={{marginRight: wp(2)}}
                size={hp(2.8)}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressCalendar}>
              <EvilIcons name="calendar" color={colors.cWhite} size={hp(3.5)} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(100),
  },
  bgImage: {
    height: hp(8),
    width: wp(100),
    justifyContent: "center",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.cWhite,
    fontFamily: Fonts.IBM_Regular,
  },
  rightSection: {
    width: "15%",
    marginRight: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
