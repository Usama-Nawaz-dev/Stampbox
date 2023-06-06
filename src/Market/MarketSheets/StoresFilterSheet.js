import React, { useContext } from "react";
import { StyleSheet, Text, View, Switch } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import CustomDropDown from "../../../components/CustomDropDown";
import { CustomButton, FloatingInput } from "../../../components";

import { Rating } from "react-native-ratings";
import ThemeContext from "../../Context/ThemeContext";

export const StoresFilterSheet = (props) => {
  const { onReset, filterValues, onApplyFilter, setFilterValue } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme?.darkGrey }]}>
        Filter Item For
      </Text>
      <View style={styles.checkSection}>
        <Text style={styles.switchText}>Saved Stores</Text>
        <Switch
          trackColor={{ false: "#767577", true: `${colors.theme}50` }}
          thumbColor={filterValues?.saved_stores ? colors.theme : "#f4f3f4"}
          ios_backgroundColor="lightgrey"
          value={filterValues?.saved_stores === 1 ? true : false}
          onValueChange={() => {
            if (filterValues?.saved_stores) {
              let myValues = filterValues;
              delete myValues.saved_stores;
              setFilterValue({ ...myValues });
            } else {
              setFilterValue({ ...filterValues, saved_stores: 1 });
            }
          }}
        />
      </View>
      <View style={styles.input}>
        <FloatingInput
          label="Find by country"
          autoCapitalize={"none"}
          value={filterValues?.country}
          onChangeText={(text) =>
            setFilterValue({ ...filterValues, country: text })
          }
        />
        <CustomDropDown
          value={filterValues?.order_by}
          data={[{ value: "rating" }, { value: "best_seller" }]}
          label={"Sort by"}
          position={-3}
          onChangeText={(value) => {
            setFilterValue({ ...filterValues, order_by: value });
          }}
        />
      </View>
      <Text style={styles.rating}>Filter by rating</Text>
      <View style={{ paddingVertical: hp(1) }}>
        <Rating
          fractions={2}
          imageSize={hp(3.5)}
          ratingCount={5}
          startingValue={filterValues?.rating ? filterValues?.rating : 0}
          onFinishRating={(val) => {
            setFilterValue({ ...filterValues, rating: val });
          }}
          style={styles.ratingStyle}
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
  input: {
    width: "90%",
    alignSelf: "center",
    marginBottom: hp(1.5),
    marginTop: -hp(2),
  },

  checkSection: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingHorizontal: wp(5),
    zIndex: 999,
  },
  switchText: {
    paddingRight: wp(3),
    color: colors.lightText,
    fontFamily: Fonts.IBM_Medium,
  },
  rating: {
    paddingHorizontal: wp(5),
    color: colors.lightText,
    fontFamily: Fonts.IBM_Regular,
  },
  ratingStyle: {
    paddingVertical: 0,
    alignSelf: "flex-start",
    marginLeft: wp(5),
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
