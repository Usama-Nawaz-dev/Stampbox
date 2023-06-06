import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Feather from "react-native-vector-icons/Feather";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import { CustomButton } from "../../../components";
import ThemeContext from "../../Context/ThemeContext";

export const WishlistSheet = (props) => {
  const { onReset, onSelectItem, onApplyFilter, placeHolderChecker } = props;

  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <View style={styles.contentSection}>
        <SelectorBtn
          title={"Filter my items"}
          onPress={() => onApplyFilter(false)}
        />
        <SelectorBtn onPress={onSelectItem} title={placeHolderChecker()} />
      </View>
      <View style={styles.btnSection}>
        <CustomButton
          label="Cancel"
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
          textColor={colors.cWhite}
          onPress={() => onApplyFilter(true)}
        />
      </View>
    </View>
  );
};

export const SelectorBtn = ({ title, onPress }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <TouchableOpacity style={[styles.itemSection]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
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
    marginTop: hp(0.5),
    color: colors.btnText,
    fontFamily: Fonts.IBM_Medium,
  },
  contentSection: {
    flex: 1,
    marginTop: hp(2.5),
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
    fontSize: 13,
    maxWidth: wp(70),
    marginLeft: hp(0.5),
    color: colors.lightBlack,
    fontFamily: Fonts.IBM_Medium,
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
