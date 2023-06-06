import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Feather from "react-native-vector-icons/Feather";

import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import ThemeContext from "../Context/ThemeContext";
import { CustomButton, FloatingInput } from "../../components";

export const WalletSheet = (props) => {
  const {
    onReset,
    onPressItem,
    filterValues,
    onApplyFilter,
    setFilterValue,
    selectedRange,
  } = props;

  const { theme } = useContext(ThemeContext);

  const onChangeValue = (index) => {
    if (index === 1) {
      setFilterValue({ ...filterValues, status: "" });
    } else if (index === 2) {
      setFilterValue({ ...filterValues, status: "credit" });
    } else if (index === 3) {
      setFilterValue({ ...filterValues, status: "debit" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme?.darkGrey }]}>
        Filter Transaction
      </Text>
      <View style={styles.input}>
        <FloatingInput
          value={filterValues?.search}
          autoCapitalize={"none"}
          label="Search Transaction"
          onChangeText={(text) =>
            setFilterValue({ ...filterValues, search: text })
          }
        />
      </View>
      <View style={styles.radioSection}>
        <View style={styles.rowSection}>
          <TouchableOpacity
            style={[
              styles.radio,
              {
                borderColor: true ? colors.theme : "#707070",
              },
            ]}
            onPress={() => onChangeValue(1)}
          >
            {filterValues?.status === "" ? (
              <View style={styles.innerRedio} />
            ) : null}
          </TouchableOpacity>
          <Text style={styles.text}>All</Text>
        </View>
        <View style={styles.rowSection}>
          <TouchableOpacity
            style={[
              styles.radio,
              {
                borderColor: true ? colors.theme : "#707070",
              },
            ]}
            onPress={() => onChangeValue(2)}
          >
            {filterValues?.status === "credit" ? (
              <View style={styles.innerRedio} />
            ) : null}
          </TouchableOpacity>
          <Text style={styles.text}>Awarded</Text>
        </View>
        <View style={styles.rowSection}>
          <TouchableOpacity
            style={[
              styles.radio,
              {
                borderColor: true ? colors.theme : "#707070",
              },
            ]}
            onPress={() => onChangeValue(3)}
          >
            {filterValues?.status === "debit" ? (
              <View style={styles.innerRedio} />
            ) : null}
          </TouchableOpacity>
          <Text style={styles.text}>Deducted</Text>
        </View>
      </View>
      <View style={styles.contentSection}>
        <SelectorBtn
          onPress={() => onPressItem("Shipping")}
          title={selectedRange ? selectedRange : "Filter By date range"}
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
  input: {
    width: "90%",
    alignSelf: "center",
    marginBottom: hp(1.5),
    marginTop: -hp(1),
  },
  radioSection: {
    borderRadius: 5,
    marginBottom: hp(1),
    paddingTop: hp(1.5),
    marginHorizontal: wp(5),
    paddingHorizontal: wp(1),
    backgroundColor: colors.background,
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp(1.5),
  },
  radio: {
    width: hp(2.7),
    height: hp(2.7),
    borderRadius: hp(1.5),
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  innerRedio: {
    height: hp(1.7),
    width: hp(1.7),
    borderRadius: 10,
    backgroundColor: colors.theme,
  },
});
