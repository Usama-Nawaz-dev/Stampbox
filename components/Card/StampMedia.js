import React, { useContext } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import AppText from "../AppText";
import colors from "../../constant/colors";
import ThemeContext from "../../src/Context/ThemeContext";

export const StampMedia = (props) => {
  const { item, marginRight, onRemoveMedia, onChangeType } = props;
  const { theme, mode } = useContext(ThemeContext);

  const isActual = item?.type === "actual";
  const isSample = item?.type === "sample";

  return (
    <View
      style={[
        styles.editStampCard,
        {
          marginRight: marginRight,
          borderColor: theme.theme,
          backgroundColor: theme.white,
        },
      ]}
    >
      <View style={styles.btnSection}>
        <TouchableOpacity
          disabled={isActual}
          onPress={() => onChangeType("actual", item)}
          style={isActual ? styles.btn1 : styles.btn2}
        >
          <AppText style={isActual ? styles.text : styles.text1}>
            Actual
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isSample}
          onPress={() => onChangeType("sample", item)}
          style={isSample ? styles.btn1 : styles.btn2}
        >
          <AppText style={isSample ? styles.text : styles.text1}>
            Sample
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.crossIcon} onPress={onRemoveMedia}>
          <EvilIcons name="close" size={hp(3)} color={theme.davyGrey} />
        </TouchableOpacity>
      </View>
      <Image
        style={styles.stampImg}
        source={{ uri: item?.uri ? item?.uri : item?.media_url }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  editStampCard: {
    width: wp(30),
    borderWidth: 2,
    borderRadius: 5,
    marginTop: hp(1),
    marginLeft: hp(1.5),
  },
  btnSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  btn1: {
    backgroundColor: colors.lightTheme,
    borderRadius: 4,
  },
  btn2: {
    backgroundColor: "lightgrey",
    borderRadius: 4,
  },
  text: {
    fontSize: 9,
    color: colors.cWhite,
    paddingHorizontal: wp(1),
    paddingVertical: wp(0.4),
  },
  text1: {
    fontSize: 9,

    color: colors.cBlack,
    paddingHorizontal: wp(1.2),
    paddingVertical: wp(0.4),
  },
  stampImg: {
    width: wp(28),
    height: hp(11),
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: hp(0.3),
  },
});
