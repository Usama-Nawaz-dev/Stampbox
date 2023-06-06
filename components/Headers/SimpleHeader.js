import React, { useContext } from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import FastImage from "react-native-fast-image";

import AppText from "../AppText";
import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import { images } from "../../assets/images/Images";
import ThemeContext from "../../src/Context/ThemeContext";

import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const SimpleHeader = (props) => {
  const { theme, mode } = useContext(ThemeContext);
  const {
    title,
    showIcon,
    rightIcon,
    showSearch,
    onPressAdd,
    onPressBack,
    onChangeValue,
    showFilter = true,
    onFilter,
  } = props;
  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
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
          {showIcon && (
            <View style={styles.rightSection}>
              <TouchableOpacity
                style={{ marginHorizontal: wp(3) }}
                onPress={onPressAdd}
              >
                <Ionicons
                  name="md-add-circle-outline"
                  color={colors.cWhite}
                  size={hp(3)}
                />
              </TouchableOpacity>
            </View>
          )}
          {rightIcon && (
            <TouchableOpacity
              style={{ marginRight: wp(3) }}
              onPress={onPressAdd}
            >
              <Entypo name="add-user" color={colors.cWhite} size={hp(3)} />
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
      {showSearch && (
        <View
          style={[
            styles.searchContainer,
            { justifyContent: showFilter ? "space-between" : "center" },
          ]}
        >
          <View
            style={[
              styles.searchSection,
              {
                width: showFilter ? wp(80) : wp(90),
              },
            ]}
          >
            <FastImage
              source={images.Search}
              style={{ width: hp(2), height: hp(2) }}
            />
            <TextInput
              style={styles.input}
              placeholder="Search here…"
              onChangeText={onChangeValue}
              placeholderTextColor={colors.placeholderText}
            />
          </View>
          {showFilter ? (
            <TouchableOpacity style={styles.filterSection} onPress={onFilter}>
              <FastImage
                source={images.Option}
                style={{ width: hp(2), height: hp(2) }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(100),
  },
  bgImage: {
    height: hp(10),
    width: wp(100),
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(2.5),
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: wp(3),
  },

  //Seadrch Section
  searchContainer: {
    opacity: 0.95,
    width: wp(100),
    marginTop: -hp(3),
    flexDirection: "row",
    paddingHorizontal: wp(3),
  },
  searchSection: {
    height: hp(5),
    width: wp(80),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: wp(3),
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: hp(0.5),
    backgroundColor: colors.cWhite,
    borderColor: colors.borderColor,
  },
  filterSection: {
    width: hp(5),
    height: hp(5),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: colors.cWhite,
    borderColor: colors.borderColor,
  },
  input: {
    fontFamily: Fonts.IBM_Regular,
    marginLeft: wp(3),
    width: wp(70),
    height: "100%",
    fontSize: 12,
  },
});
