import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../constant/colors";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Fonts from "../../assets/fonts/Fonts";

import { images } from "../../assets/images/Images";
import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";

export const MediaSheet = (props) => {
  const {
    onSelectPhone, onPressCancel, onSelectStampbox,
    showStampBtn, onChooseStamp
  } = props;
  const { myState: { language } } = useContext(AuthContext);
  const { theme }= useContext(ThemeContext);

  return (
    <View style={[styles.container, {backgroundColor: theme?.white}]}>
      <Text style={[styles.heading, {color: theme?.darkGrey}]}>{language?.selectMedia}</Text>
      <View style={[styles.contentSection, { marginTop: showStampBtn ? hp(4) : hp(2.7) }]}>
        <TouchableOpacity style={styles.itemSection} onPress={onSelectPhone}>
          <MaterialIcons
            name="phone-iphone"
            size={hp(3.2)}
            color={colors.lightBlack}
          />
          <Text style={styles.text}>Choose From Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemSection} onPress={onSelectStampbox}>
          <Image source={images.Box} style={styles.icon} resizeMode="contain" />
          <Text style={styles.text}>Choose From My Stampbox</Text>
        </TouchableOpacity>
        {showStampBtn &&
          <TouchableOpacity style={styles.itemSection} onPress={onChooseStamp}>
            <FontAwesome5
              name="stamp"
              size={hp(2.8)}
              color={colors.lightBlack}
              style={{ marginRight: 5 }}
            />
            <Text style={styles.text}>
              Choose From {props?.label3 ? props?.label3 : language?.myStamp}
            </Text>
          </TouchableOpacity>}
      </View>
      <TouchableOpacity style={styles.cancelBtn} onPress={onPressCancel}>
        <Text style={[styles.cancelText, { color: theme?.lightText}]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontFamily: "IBMPlexSans-Bold",
    textAlign: "center",
    color: colors.lightBlack,
    marginTop: hp(1.5),
  },
  contentSection: {
    flex: 1,
    alignItems: "center",
  },
  itemSection: {
    height: hp(5.5),
    width: "90%",
    backgroundColor: colors.background,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: hp(2),
  },
  icon: {
    width: hp(3.2),
    height: hp(2.8),
    tintColor: colors.lightBlack,
    marginRight: hp(0.3),
  },
  text: {
    fontSize: 14,
    color: colors.lightBlack,
    fontFamily: Fonts.Roboto_Regular,
    marginLeft: hp(0.5),
  },
  cancelBtn: {
    marginVertical: hp(2),
    position: "absolute",
    bottom: hp(1.5),
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: colors.btnText,
    fontWeight: "500",
  },
});
