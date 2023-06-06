import React, { useContext } from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import FastImage from "react-native-fast-image";

import colors from "../../constant/colors";
import { images } from "../../assets/images/Images";

import AppText from "../AppText";
import ThemeContext from "../../src/Context/ThemeContext";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const EventHeader = (props) => {
  const { theme, mode } = useContext(ThemeContext);
  const { title, rightIcon, onEdit, onDelete, onPressBack, pickerIcon } = props;
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
          {rightIcon && (
            <View style={styles.rightSection}>
              <TouchableOpacity
                style={{ marginRight: wp(3) }}
                onPress={onDelete}
              >
                <FastImage
                  source={images.Remove}
                  style={styles.removeIcon}
                  tintColor={colors.cWhite}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onEdit}>
                <FastImage
                  source={images.EditIcon}
                  style={styles.removeIcon}
                  tintColor={colors.cWhite}
                />
              </TouchableOpacity>
            </View>
          )}
          {pickerIcon && pickerIcon}
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "IBMPlexSans-Regular",
    color: colors.cWhite,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: wp(3),
    justifyContent: "center",
  },
  removeIcon: {
    height: hp(3),
    width: hp(3),
    resizeMode: "contain",
  },
});
