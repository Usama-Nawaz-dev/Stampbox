import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Feather from "react-native-vector-icons/Feather";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import { CustomButton, FloatingInput } from "../../../components";

import { SelectorBtn } from "./SaleFilterSheet";
import { SubItem } from "./SaleFilterSheet";
import ThemeContext from "../../Context/ThemeContext";

export const BountyFilterSheet = (props) => {
  const {
    onReset,
    yearRange,
    onPressItem,
    filterValues,
    onApplyFilter,
    filterCountries,
    placeHolderChecker,
  } = props;
  const { theme }= useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme?.darkGrey}]}>Filter Item For</Text>
      <View style={styles.contentSection}>
        <SelectorBtn
          onPress={() => onPressItem("Years")}
          title={yearRange ? yearRange : "Filter By Year Range"}
        />
        <SelectorBtn
          onPress={() => onPressItem("Country")}
          title={placeHolderChecker(filterCountries, "Item Location (Country)")}
        />
        <View style={styles.moreSection}>
          <View style={styles.itemSection1}>
            <Text style={styles.text}>More Filters</Text>
            <Feather name="chevron-down" size={hp(3)} color={colors.btnText} />
          </View>
          <View style={[styles.otherSection]}>
            <SubItem
              onPress={() => onPressItem("Grade")}
              title={filterValues?.grade ? filterValues?.grade : "Grade"}
            />
            <SubItem
              onPress={() => onPressItem("Condition")}
              title={
                filterValues?.condition ? filterValues?.condition : "Condition"
              }
            />
            <SubItem
              onPress={() => onPressItem("Color")}
              title={filterValues?.color ? filterValues?.color : "Color"}
            />
            <SubItem
              onPress={() => onPressItem("Quality")}
              title={filterValues?.quality ? filterValues?.quality : "Quality"}
            />
            <SubItem
              onPress={() => onPressItem("Format")}
              title={filterValues?.format ? filterValues?.format : "Format"}
            />
          </View>
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
  },
  heading: {
    fontSize: 14,
    marginLeft: wp(5),
    marginTop: hp(0.5),
    marginBottom: hp(1.5),
    color: colors.btnText,
    fontFamily: Fonts.IBM_Medium,
  },
  contentSection: {
    flex: 1,
    alignItems: "center",
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
  moreSection: {
    width: "90%",
    borderRadius: 5,
    marginBottom: hp(2),
    paddingHorizontal: wp(3),
    backgroundColor: colors.background,
  },
  itemSection1: {
    height: hp(4.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  otherSection: {
    borderRadius: 5,
    marginBottom: hp(1),
    paddingBottom: hp(1),
    paddingHorizontal: wp(2),
    backgroundColor: colors.cWhite,
  },
});
