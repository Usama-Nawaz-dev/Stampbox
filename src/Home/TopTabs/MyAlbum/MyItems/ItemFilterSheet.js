import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Feather from "react-native-vector-icons/Feather";

import colors from "../../../../../constant/colors";
import Fonts from "../../../../../assets/fonts/Fonts";
import AppText from "../../../../../components/AppText";
import { CustomButton } from "../../../../../components";
import ThemeContext from "../../../../Context/ThemeContext";

export const ItemFilterSheet = (props) => {
  const { onReset, onPressItem, filterValues, onApplyFilter } = props;

  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <AppText style={[styles.heading, { color: theme?.darkGrey }]}>
        Filter Item For
      </AppText>
      <View style={styles.contentSection}>
        <SelectorBtn
          onPress={() => onPressItem("Country")}
          title={
            filterValues?.country ? filterValues?.country : "Filter By Country"
          }
        />
        <SelectorBtn
          onPress={() => onPressItem("Format")}
          title={
            filterValues?.format ? filterValues?.format : "Filter By Format"
          }
        />
      </View>
      <View style={styles.btnSection}>
        <CustomButton
          label="Reset"
          fontSize={12}
          width={wp(43)}
          height={hp(5)}
          onPress={onReset}
          bg={colors.background}
          textColor={colors.placeholderText}
        />
        <CustomButton
          label="Filter"
          fontSize={12}
          width={wp(43)}
          height={hp(5)}
          bg={colors.color8}
          onPress={onApplyFilter}
          textColor={colors.cWhite}
        />
      </View>
    </View>
  );
};

export const SelectorBtn = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.itemSection} onPress={onPress}>
      <AppText style={styles.text}>{title}</AppText>
      <Feather name="chevron-down" size={hp(3)} color={colors.btnText} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
  },
  heading: {
    fontSize: 14,
    marginLeft: wp(5),
    color: colors.btnText,
    fontFamily: Fonts.IBM_Medium,
  },
  contentSection: {
    flex: 1,
    alignItems: "center",
    marginTop: hp(3),
  },
  itemSection: {
    width: "90%",
    height: hp(5.5),
    borderRadius: 5,
    marginBottom: hp(1.5),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 12,
    maxWidth: wp(70),
    marginLeft: hp(0.5),
    color: colors.btnText,
    fontFamily: Fonts.IBM_Regular,
  },
  btnSection: {
    width: "100%",
    bottom: hp(2.5),
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
  },
});
