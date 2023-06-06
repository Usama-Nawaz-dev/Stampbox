import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Feather from "react-native-vector-icons/Feather";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import AppText from "../../../components/AppText";
import { CustomButton, FloatingInput } from "../../../components";
import ThemeContext from "../../Context/ThemeContext";

export const SaleFilterSheet = (props) => {
  const {
    onReset,
    yearRange,
    filterType,
    onPressItem,
    filterValues,
    filterTopics,
    onApplyFilter,
    setFilterValue,
    filterCountries,
    filterCategories,
    placeHolderChecker,
  } = props;
  const { theme }= useContext(ThemeContext)

  const [policy, setPolicy] = useState(false);

  const onChangeValue = (index) => {
    if (index === 1) {
      setFilterValue({ ...filterValues, accepting_offer: "coins" });
    } else if (index === 2) {
      setFilterValue({ ...filterValues, accepting_offer: "stamps" });
    } else if (index === 3) {
      setFilterValue({ ...filterValues, accepting_offer: "coins_and_stamps" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme?.darkGrey}]}>Filter Item For</Text>
      <View style={styles.input}>
        {filterType === "Sale" ? (
          <FloatingInput
            label="Store ID"
            value={filterValues?.store_uid}
            autoCapitalize={"none"}
            onChangeText={(text) =>
              setFilterValue({ ...filterValues, store_uid: text })
            }
          />
        ) : (
          <FloatingInput
            label="Member ID"
            value={filterValues?.member_id}
            autoCapitalize={"none"}
            onChangeText={(text) =>
              setFilterValue({ ...filterValues, member_id: text })
            }
          />
        )}
        {filterType === "Trade" && (
          <View>
            <AppText style={[styles.offerText, { color: theme?.darkGrey}]}>Filter by Offer Type</AppText>
            <View style={styles.radioSection}>
              <View style={styles.rowSection}>
                <TouchableOpacity
                  style={[
                    styles.radio,
                    {
                      borderColor:
                        filterValues?.accepting_offer === "coins"
                          ? colors.theme
                          : "#707070",
                    },
                  ]}
                  onPress={() => onChangeValue(1)}
                >
                  {filterValues?.accepting_offer === "coins" ? (
                    <View style={styles.innerRedio} />
                  ) : null}
                </TouchableOpacity>
                <Text style={styles.text}>Coins</Text>
              </View>
              <View style={styles.rowSection}>
                <TouchableOpacity
                  style={[
                    styles.radio,
                    {
                      borderColor:
                        filterValues?.accepting_offer === "stamps"
                          ? colors.theme
                          : "#707070",
                    },
                  ]}
                  onPress={() => onChangeValue(2)}
                >
                  {filterValues?.accepting_offer === "stamps" ? (
                    <View style={styles.innerRedio} />
                  ) : null}
                </TouchableOpacity>
                <Text style={styles.text}>Stamps </Text>
              </View>
              <View style={styles.rowSection}>
                <TouchableOpacity
                  style={[
                    styles.radio,
                    {
                      borderColor:
                        filterValues?.accepting_offer === "coins_and_stamps"
                          ? colors.theme
                          : "#707070",
                    },
                  ]}
                  onPress={() => onChangeValue(3)}
                >
                  {filterValues?.accepting_offer === "coins_and_stamps" ? (
                    <View style={styles.innerRedio} />
                  ) : null}
                </TouchableOpacity>
                <Text style={styles.text}>Coins & Stamps</Text>
              </View>
            </View>
          </View>
        )}
      </View>
      <View style={styles.contentSection}>
        <SelectorBtn
          onPress={() => onPressItem("Years")}
          title={yearRange ? yearRange : "Filter By Year Range"}
        />
        <SelectorBtn
          onPress={() => onPressItem("Country")}
          title={placeHolderChecker(filterCountries, "Item Location (Country)")}
        />
        <SelectorBtn
          onPress={() => onPressItem("Topic")}
          title={placeHolderChecker(filterTopics, "Filter By Topics")}
        />
        <SelectorBtn
          onPress={() => onPressItem("Category")}
          title={placeHolderChecker(filterCategories, "Filter By Categories")}
        />
        <SelectorBtn
          onPress={() => onPressItem("Shipping")}
          title={
            filterValues?.shiping_option
              ? filterValues?.shiping_option
              : "Filter By Shipping"
          }
        />
        <View style={styles.moreSection}>
          <View style={styles.itemSection1}>
            <Text style={styles.text}>More Filters</Text>
            <Feather name="chevron-down" size={hp(3)} color={colors.btnText} />
          </View>
          <View style={styles.otherSection}>
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

export const SelectorBtn = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.itemSection} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
      <Feather name="chevron-down" size={hp(3)} color={colors.btnText} />
    </TouchableOpacity>
  );
};

export const SubItem = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.subItem} onPress={onPress}>
      <Text style={[styles.text, { fontSize: 10 }]}>{title}</Text>
      <Feather name="chevron-down" size={hp(2.2)} color={colors.btnText} />
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
  subItem: {
    marginTop: hp(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    width: "90%",
    alignSelf: "center",
    marginBottom: hp(1.5),
    marginTop: -hp(1.5),
  },
  offerText: {
    fontSize: 12,
    color: colors.lightText,
    paddingVertical: hp(0.5),
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
  radioSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
  },
});
