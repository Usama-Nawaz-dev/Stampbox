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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

import ThemeContext from "../../src/Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const ProfileHeader = (props) => {
  const { theme, mode } = useContext(ThemeContext);
  const { title, onPressBack, edit = true, onChangePass, onEdit } = props;
  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <ImageBackground
        style={styles.bgImage}
        resizeMode="stretch"
        source={images.Header1}
      >
        <View style={styles.topSection}>
          <View style={styles.titleSection}>
            <TouchableOpacity
              onPress={onPressBack}
              style={{ paddingHorizontal: wp(3) }}
            >
              <FastImage
                source={images.ArrowLeft}
                resizeMode="contain"
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <AppText style={styles.titleText}>{title}</AppText>
          </View>
          {edit ? (
            <View style={styles.rightSection}>
              <TouchableOpacity onPress={onEdit}>
                <Feather name="edit" color={colors.cWhite} size={22} />
                {/* <FastImage
                  resizeMode="contain"
                  source={images.EditIcon}
                  style={styles.iconStyle}
                  tintColor={colors.cWhite}
                /> */}
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginLeft: 15 }}
                onPress={onChangePass}
              >
                <MaterialIcons name="lock" color={colors.cWhite} size={24} />
                {/* <FastImage
                  resizeMode="contain"
                  source={images.Lock}
                  style={styles.iconStyle}
                  tintColor={colors.cWhite}
                /> */}
              </TouchableOpacity>
            </View>
          ) : null}
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
    height: 117,
    width: wp(100),
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  backIcon: {
    height: hp(2.5),
    width: hp(1.2),
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "IBMPlexSans-Regular",
    color: colors.cWhite,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: wp(3),
  },
  iconStyle: {
    height: hp(2.7),
    width: hp(2.7)
  }
});
